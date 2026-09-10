"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getOrCreateGuestId } from "@/lib/guest";

export async function addToCart(variantId: string, quantity: number) {
  const guestId = await getOrCreateGuestId();

  const variant = await prisma.productVariant.findUniqueOrThrow({
    where: { id: variantId },
    include: { product: true },
  });
  const unitPrice = variant.priceOverride ?? variant.product.basePrice;

  const cart = await prisma.cart.upsert({
    where: { cookieToken: guestId },
    update: {},
    create: { cookieToken: guestId },
  });

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
        priceSnapshot: unitPrice,
      },
    });
  }

  revalidatePath("/cart");
}
