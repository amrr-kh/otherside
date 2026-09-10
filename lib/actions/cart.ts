"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getOrCreateGuestId, peekGuestId } from "@/lib/guest";

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

async function assertOwnsCartItem(itemId: string) {
  const guestId = await peekGuestId();
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });
  if (!item || !guestId || item.cart.cookieToken !== guestId) {
    throw new Error("Cart item not found.");
  }
  return item;
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  await assertOwnsCartItem(itemId);

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  revalidatePath("/cart");
}

export async function removeCartItem(itemId: string) {
  await assertOwnsCartItem(itemId);
  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/cart");
}
