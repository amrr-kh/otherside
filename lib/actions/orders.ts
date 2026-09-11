"use server";

import { randomUUID } from "node:crypto";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { logEvent } from "@/lib/logger";
import { notifyNewOrder } from "@/lib/notifications/notifyNewOrder";
import { logOrderToSheet } from "@/lib/notifications/googleSheets";
import { getOrCreateGuestId } from "@/lib/guest";
import type { PaymentMethod } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";

export type PlaceOrderState =
  | { status: "idle" }
  | { status: "error"; message: string };

const EGYPT_PHONE_RE = /^01[0125][0-9]{8}$/;

// Business-rule failures inside the order transaction (out of stock, a
// promo code that just got used up, an unknown shipping zone) — distinct
// from database/connection failures, so placeOrder can show the customer
// the right message for each.
class OrderValidationError extends Error {
  constructor(public readonly code: string) {
    super(code);
  }
}

// Codes/messages that mean "the database could not be reached or the
// operation timed out" rather than "the checkout data was invalid" — used
// only to pick the right customer-facing message, not to decide retries
// (that narrower, read/write-aware decision lives in lib/db/index.ts).
function isDatabaseUnavailableError(error: unknown): boolean {
  const code = (error as { code?: string } | undefined)?.code;
  // @prisma/adapter-pg surfaces the raw Node error code (ETIMEDOUT,
  // ECONNREFUSED, ECONNRESET) directly as .code, not always wrapped in a
  // P1xxx Prisma code — checked directly, not just via the message regex
  // below (a real miss here was caught live during testing).
  const knownCodes = [
    "P1001",
    "P1002",
    "P1008",
    "P1017",
    "P2024",
    "P2028",
    "ETIMEDOUT",
    "ECONNREFUSED",
    "ECONNRESET",
  ];
  if (code && knownCodes.includes(code)) {
    return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return /ETIMEDOUT|ECONNREFUSED|ECONNRESET|Connection terminated|expired transaction/i.test(
    message,
  );
}

function isIdempotencyKeyConflict(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
    return false;
  }
  // The @prisma/adapter-pg driver nests the real constraint name differently
  // than the classic engine does (meta.target isn't reliably an array here),
  // but the constraint name always shows up in the message and in meta as
  // plain text either way — checked directly rather than assuming one shape.
  return (
    /idempotencyKey/i.test(error.message) ||
    /idempotencyKey/i.test(JSON.stringify(error.meta ?? {}))
  );
}

function required(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function placeOrder(
  _prevState: PlaceOrderState,
  formData: FormData,
): Promise<PlaceOrderState> {
  const requestId = `req_${randomUUID().slice(0, 12)}`;
  const guestId = await getOrCreateGuestId();

  // One idempotency key per checkout-form render (CheckoutForm generates it
  // once via useState and resubmits the same value on retry). A missing key
  // (JS-disabled or a very old cached page) falls back to a fresh one —
  // that submission just won't be double-click-safe, which is still better
  // than hard-failing the whole checkout.
  const idempotencyKey = required(formData, "idempotencyKey") || randomUUID();

  // Fast path: this exact checkout attempt already succeeded (double-click,
  // browser retry, refresh-and-resubmit). Return the order that was already
  // created instead of re-running any validation or side effects.
  const existingOrder = await prisma.order.findUnique({
    where: { idempotencyKey },
    select: { orderNumber: true },
  });
  if (existingOrder) {
    logEvent("checkout_duplicate_submission", { requestId, idempotencyKey });
    const locale = await getLocale();
    redirect({ href: `/order-confirmation/${existingOrder.orderNumber}`, locale });
  }

  const cart = await prisma.cart.findUnique({
    where: { cookieToken: guestId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { include: { options: { include: { values: true } } } },
              optionValues: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return { status: "error", message: "cartEmpty" };
  }
  const cartId = cart.id;
  const cartItems = cart.items;

  function getColorAndSize(item: (typeof cartItems)[number]) {
    const colorOption = item.variant.product.options.find(
      (o) => o.name === "Color",
    );
    const colorValueIds = new Set(colorOption?.values.map((v) => v.id));
    const colorValue = item.variant.optionValues.find((ov) =>
      colorValueIds.has(ov.id),
    );
    const sizeValue = item.variant.optionValues.find(
      (ov) => !colorValueIds.has(ov.id),
    );
    return { color: colorValue?.value ?? "", size: sizeValue?.value ?? "" };
  }

  const name = required(formData, "name");
  const phone = required(formData, "phone");
  const email = required(formData, "email").toLowerCase();
  const governorate = required(formData, "governorate");
  const city = required(formData, "city");
  const street = required(formData, "street");
  const building = required(formData, "building");
  const floor = required(formData, "floor");
  const apartment = required(formData, "apartment");
  const landmark = required(formData, "landmark");
  const notes = required(formData, "notes");
  const paymentMethod = required(formData, "paymentMethod") as PaymentMethod;
  const promoCodeRaw = required(formData, "promoCode").toUpperCase();

  if (!name || !phone || !governorate || !city || !street || !building) {
    return { status: "error", message: "missingFields" };
  }
  if (!EGYPT_PHONE_RE.test(phone)) {
    return { status: "error", message: "invalidPhone" };
  }
  if (!["COD", "INSTAPAY", "MOBILE_WALLET"].includes(paymentMethod)) {
    return { status: "error", message: "missingFields" };
  }

  let orderNumber: string;
  let isNewOrder: boolean;
  let subtotal = 0;
  let shippingCost = 0;
  let discountAmount = 0;

  try {
    const result = await createOrderRecords();
    orderNumber = result.orderNumber;
    isNewOrder = result.isNewOrder;
    subtotal = result.subtotal;
    shippingCost = result.shippingCost;
    discountAmount = result.discountAmount;
  } catch (error) {
    logEvent("checkout_failed", {
      requestId,
      idempotencyKey,
      errorCode: (error as { code?: string } | undefined)?.code ?? null,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      databaseUnavailable: isDatabaseUnavailableError(error),
    });

    if (error instanceof OrderValidationError) {
      return { status: "error", message: error.code };
    }
    if (isDatabaseUnavailableError(error)) {
      // Safe to say "not duplicated" unconditionally: the transaction never
      // partially committed (Postgres rolled it back), and if the customer
      // retries with the same form, the idempotency key above returns the
      // order instead of creating a second one.
      return { status: "error", message: "connectionError" };
    }
    console.error(`placeOrder failed [${requestId}]:`, error);
    return { status: "error", message: "generic" };
  }

  if (isNewOrder) {
    const itemsSummary = cartItems
      .map((item) => {
        const { color, size } = getColorAndSize(item);
        return `${item.variant.product.name} (${color}/${size}) x${item.quantity}`;
      })
      .join("; ");

    await Promise.all([
      notifyNewOrder({
        orderNumber,
        customerName: name,
        customerPhone: phone,
        total: subtotal + shippingCost - discountAmount,
        paymentMethod,
        governorate,
        city,
      }),
      logOrderToSheet({
        orderNumber,
        createdAt: new Date().toISOString(),
        customerName: name,
        phone,
        email,
        governorate,
        city,
        items: itemsSummary,
        subtotal,
        shippingCost,
        discountCode: discountAmount > 0 ? promoCodeRaw : "",
        discountAmount,
        total: subtotal + shippingCost - discountAmount,
        paymentMethod,
      }),
    ]);
  }

  const locale = await getLocale();
  redirect({ href: `/order-confirmation/${orderNumber}`, locale });
  return { status: "idle" };

  async function createOrderRecords(): Promise<{
    orderNumber: string;
    isNewOrder: boolean;
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
  }> {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          // Re-check everything against the database inside the
          // transaction — never trust variant/price/stock/shipping/discount
          // data read before the transaction started, since it can go stale
          // in the time the customer spends filling out the form, and never
          // trust anything the client could have influenced.
          const freshVariants = await Promise.all(
            cartItems.map((item) =>
              tx.productVariant.findUniqueOrThrow({
                where: { id: item.variant.id },
                include: { product: true },
              }),
            ),
          );

          for (const variant of freshVariants) {
            if (!variant.isActive) throw new OrderValidationError("outOfStock");
          }

          const unitPriceByVariantId = new Map(
            freshVariants.map((v) => [
              v.id,
              Number(v.priceOverride ?? v.product.basePrice),
            ]),
          );

          const subtotal = cartItems.reduce(
            (sum, item) =>
              sum + (unitPriceByVariantId.get(item.variant.id) ?? 0) * item.quantity,
            0,
          );

          const zone = await tx.shippingZone.findFirst({
            where: { isActive: true, governorates: { has: governorate } },
          });
          if (!zone) throw new OrderValidationError("noShippingZone");

          const freeThreshold = zone.freeShippingThreshold
            ? Number(zone.freeShippingThreshold)
            : null;
          const shippingCost =
            freeThreshold !== null && subtotal >= freeThreshold
              ? 0
              : Number(zone.price);

          let discountAmount = 0;
          let discountRecordId: string | null = null;
          let discountTimesUsedSeen = 0;

          if (promoCodeRaw) {
            const discount = await tx.discountCode.findUnique({
              where: { code: promoCodeRaw },
            });
            const validNow =
              discount &&
              discount.isActive &&
              (!discount.expiresAt || discount.expiresAt >= new Date()) &&
              (discount.usageLimit === null ||
                discount.timesUsed < discount.usageLimit) &&
              (!discount.minSubtotal || subtotal >= Number(discount.minSubtotal));

            if (!discount || !validNow) {
              throw new OrderValidationError("invalidPromo");
            }

            const value = Number(discount.value);
            discountAmount =
              discount.type === "PERCENT"
                ? Math.round(subtotal * (value / 100) * 100) / 100
                : Math.min(value, subtotal);
            discountRecordId = discount.id;
            discountTimesUsedSeen = discount.timesUsed;
          }

          const total = subtotal + shippingCost - discountAmount;

          const customer = await tx.customer.upsert({
            where: { phone },
            update: { name, email: email || undefined },
            create: { name, phone, email: email || undefined },
          });

          await tx.address.create({
            data: {
              customerId: customer.id,
              governorate,
              city,
              street,
              building,
              floor: floor || null,
              apartment: apartment || null,
              landmark: landmark || null,
            },
          });

          const [{ val: nextSeq }] = await tx.$queryRaw<{ val: bigint }[]>(
            Prisma.sql`SELECT nextval('"Order_sequence_seq"') as val`,
          );
          const orderNumber = `OS-${10000 + Number(nextSeq)}`;

          await tx.order.create({
            data: {
              sequence: Number(nextSeq),
              orderNumber,
              idempotencyKey,
              customerId: customer.id,
              status: "RECEIVED",
              subtotal,
              shippingCost,
              discountCode: discountAmount > 0 ? promoCodeRaw : null,
              discountAmount,
              total,
              paymentMethod,
              addressSnapshot: {
                name,
                phone,
                governorate,
                city,
                street,
                building,
                floor,
                apartment,
                landmark,
              },
              notes: notes || null,
              items: {
                create: cartItems.map((item) => {
                  const { color, size } = getColorAndSize(item);
                  return {
                    variantId: item.variant.id,
                    productNameSnapshot: item.variant.product.name,
                    colorSnapshot: color,
                    sizeSnapshot: size,
                    unitPrice: unitPriceByVariantId.get(item.variant.id) ?? 0,
                    quantity: item.quantity,
                  };
                }),
              },
              statusHistory: { create: { status: "RECEIVED" } },
            },
          });

          if (discountRecordId) {
            // Optimistic-lock increment: only succeeds if no other order
            // used this same code in between our check and this
            // transaction — if it lost the race, this throws and the whole
            // order rolls back rather than overselling a capped code.
            const result = await tx.discountCode.updateMany({
              where: { id: discountRecordId, timesUsed: discountTimesUsedSeen },
              data: { timesUsed: { increment: 1 } },
            });
            if (result.count !== 1) {
              throw new OrderValidationError("invalidPromo");
            }
          }

          for (const item of cartItems) {
            // Conditional decrement: only succeeds if enough stock is still
            // there at this exact moment. A DB-level CHECK constraint on
            // quantity >= 0 backs this up in case this guard is ever
            // bypassed, but this is what turns "two customers buy the last
            // unit" into a clean "out of stock" for the loser instead of a
            // negative-inventory error.
            const decremented = await tx.inventory.updateMany({
              where: { variantId: item.variant.id, quantity: { gte: item.quantity } },
              data: { quantity: { decrement: item.quantity } },
            });
            if (decremented.count !== 1) {
              throw new OrderValidationError("outOfStock");
            }
          }

          await tx.cartItem.deleteMany({ where: { cartId } });

          return { orderNumber, subtotal, shippingCost, discountAmount };
        },
        // Cold-start-tolerant: Neon's free-tier compute can take a few
        // seconds to wake from suspend, and this transaction does several
        // round trips (variant/shipping/discount lookups, order + items,
        // inventory decrements). Prisma's 5s/2s defaults were observed to
        // fail under a genuine cold start in testing.
        { timeout: 15000, maxWait: 8000 },
      );

      return { ...result, isNewOrder: true };
    } catch (error) {
      if (isIdempotencyKeyConflict(error)) {
        // Someone else (a concurrent retry of this same submission) won the
        // race and already created this order — that's a success, not a
        // failure, just not a new one.
        const order = await prisma.order.findUniqueOrThrow({
          where: { idempotencyKey },
          select: { orderNumber: true, subtotal: true, shippingCost: true, discountAmount: true },
        });
        return {
          orderNumber: order.orderNumber,
          isNewOrder: false,
          subtotal: Number(order.subtotal),
          shippingCost: Number(order.shippingCost),
          discountAmount: Number(order.discountAmount),
        };
      }
      throw error;
    }
  }
}
