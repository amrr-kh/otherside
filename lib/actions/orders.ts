"use server";

import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { notifyNewOrder } from "@/lib/notifications/notifyNewOrder";
import { getOrCreateGuestId } from "@/lib/guest";
import type { PaymentMethod } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";

export type PlaceOrderState =
  | { status: "idle" }
  | { status: "error"; message: string };

const EGYPT_PHONE_RE = /^01[0125][0-9]{8}$/;

function required(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function placeOrder(
  _prevState: PlaceOrderState,
  formData: FormData,
): Promise<PlaceOrderState> {
  const guestId = await getOrCreateGuestId();

  const cart = await prisma.cart.findUnique({
    where: { cookieToken: guestId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { options: { include: { values: true } } },
              },
              optionValues: true,
              inventory: true,
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

  const name = required(formData, "name");
  const phone = required(formData, "phone");
  const email = required(formData, "email");
  const governorate = required(formData, "governorate");
  const city = required(formData, "city");
  const street = required(formData, "street");
  const building = required(formData, "building");
  const floor = required(formData, "floor");
  const apartment = required(formData, "apartment");
  const landmark = required(formData, "landmark");
  const notes = required(formData, "notes");
  const paymentMethod = required(formData, "paymentMethod") as PaymentMethod;

  if (!name || !phone || !governorate || !city || !street || !building) {
    return { status: "error", message: "missingFields" };
  }
  if (!EGYPT_PHONE_RE.test(phone)) {
    return { status: "error", message: "invalidPhone" };
  }
  if (!["COD", "INSTAPAY", "MOBILE_WALLET"].includes(paymentMethod)) {
    return { status: "error", message: "missingFields" };
  }

  // Re-validate stock server-side — never trust what was shown on the cart page.
  for (const item of cartItems) {
    const available = item.variant.inventory?.quantity ?? 0;
    if (!item.variant.isActive || available < item.quantity) {
      return { status: "error", message: "outOfStock" };
    }
  }

  const zone = await prisma.shippingZone.findFirst({
    where: { isActive: true, governorates: { has: governorate } },
  });
  if (!zone) {
    return { status: "error", message: "noShippingZone" };
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.priceSnapshot) * item.quantity,
    0,
  );

  // Discount is always re-validated and recomputed here — never trust the
  // amount shown by the client-side preview.
  const promoCodeRaw = required(formData, "promoCode").toUpperCase();
  let discountCode: string | null = null;
  let discountAmount = 0;
  let discountRecordId: string | null = null;
  let discountTimesUsedSeen = 0;

  if (promoCodeRaw) {
    const discount = await prisma.discountCode.findUnique({
      where: { code: promoCodeRaw },
    });
    const validNow =
      discount &&
      discount.isActive &&
      (!discount.expiresAt || discount.expiresAt >= new Date()) &&
      (discount.usageLimit === null || discount.timesUsed < discount.usageLimit) &&
      (!discount.minSubtotal || subtotal >= Number(discount.minSubtotal));

    if (!discount || !validNow) {
      return { status: "error", message: "invalidPromo" };
    }

    const value = Number(discount.value);
    discountAmount =
      discount.type === "PERCENT"
        ? Math.round(subtotal * (value / 100) * 100) / 100
        : Math.min(value, subtotal);
    discountCode = promoCodeRaw;
    discountRecordId = discount.id;
    discountTimesUsedSeen = discount.timesUsed;
  }

  const freeThreshold = zone.freeShippingThreshold
    ? Number(zone.freeShippingThreshold)
    : null;
  const shippingCost =
    freeThreshold !== null && subtotal >= freeThreshold ? 0 : Number(zone.price);
  const total = subtotal + shippingCost - discountAmount;

  let orderNumber: string;
  try {
    orderNumber = await createOrderRecords();
  } catch (error) {
    console.error("placeOrder failed:", error);
    return { status: "error", message: "generic" };
  }

  await notifyNewOrder({
    orderNumber,
    customerName: name,
    customerPhone: phone,
    total,
    paymentMethod,
    governorate,
    city,
  });

  const locale = await getLocale();
  redirect({ href: `/order-confirmation/${orderNumber}`, locale });
  return { status: "idle" };

  async function createOrderRecords(): Promise<string> {
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: { name, email: email || undefined },
      create: { name, phone, email: email || undefined },
    });

    await prisma.address.create({
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

    return prisma.$transaction(async (tx) => {
      const [{ val: nextSeq }] = await tx.$queryRaw<{ val: bigint }[]>(
        Prisma.sql`SELECT nextval('"Order_sequence_seq"') as val`,
      );
      const orderNumber = `OS-${10000 + Number(nextSeq)}`;

      await tx.order.create({
        data: {
          sequence: Number(nextSeq),
          orderNumber,
          customerId: customer.id,
          status: "RECEIVED",
          subtotal,
          shippingCost,
          discountCode,
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
              const colorOption = item.variant.product.options.find(
                (o) => o.name === "Color",
              );
              const colorValueIds = new Set(
                colorOption?.values.map((v) => v.id),
              );
              const colorValue = item.variant.optionValues.find((ov) =>
                colorValueIds.has(ov.id),
              );
              const sizeValue = item.variant.optionValues.find(
                (ov) => !colorValueIds.has(ov.id),
              );
              return {
                variantId: item.variant.id,
                productNameSnapshot: item.variant.product.name,
                colorSnapshot: colorValue?.value ?? "",
                sizeSnapshot: sizeValue?.value ?? "",
                unitPrice: item.priceSnapshot,
                quantity: item.quantity,
              };
            }),
          },
          statusHistory: { create: { status: "RECEIVED" } },
        },
      });

      if (discountRecordId) {
        // Optimistic-lock increment: only succeeds if no other order used
        // this same code in between our check and this transaction — if it
        // lost the race, this throws and the whole order rolls back rather
        // than overselling a capped discount code.
        const result = await tx.discountCode.updateMany({
          where: { id: discountRecordId, timesUsed: discountTimesUsedSeen },
          data: { timesUsed: { increment: 1 } },
        });
        if (result.count !== 1) {
          throw new Error("Discount code was just used up — please retry.");
        }
      }

      for (const item of cartItems) {
        await tx.inventory.update({
          where: { variantId: item.variant.id },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId } });

      return orderNumber;
    });
  }
}
