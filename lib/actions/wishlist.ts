"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getOrCreateGuestId } from "@/lib/guest";

export async function toggleWishlist(productId: string, pathname: string) {
  const guestId = await getOrCreateGuestId();

  const wishlist = await prisma.wishlist.upsert({
    where: { guestToken: guestId },
    update: {},
    create: { guestToken: guestId },
  });

  const existing = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });
  }

  revalidatePath(pathname);
  revalidatePath("/wishlist");
}
