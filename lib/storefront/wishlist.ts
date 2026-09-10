import "server-only";
import { prisma } from "@/lib/db";
import { peekGuestId } from "@/lib/guest";
import type { StorefrontProduct } from "./products";
import { toStorefrontProduct, productMediaInclude } from "./products";

export async function getWishlistProductIds(): Promise<Set<string>> {
  const guestId = await peekGuestId();
  if (!guestId) return new Set();

  const wishlist = await prisma.wishlist.findUnique({
    where: { guestToken: guestId },
    include: { items: { select: { productId: true } } },
  });
  return new Set(wishlist?.items.map((i) => i.productId) ?? []);
}

export async function getWishlistProducts(): Promise<StorefrontProduct[]> {
  const guestId = await peekGuestId();
  if (!guestId) return [];

  const wishlist = await prisma.wishlist.findUnique({
    where: { guestToken: guestId },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: { product: { include: productMediaInclude } },
      },
    },
  });
  if (!wishlist) return [];

  return wishlist.items
    .filter((item) => item.product.status === "ACTIVE")
    .map((item) => toStorefrontProduct(item.product));
}
