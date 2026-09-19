"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { readPromotionFields } from "@/lib/promotion-form";

// The bar sits at the top of every storefront page, so any change refreshes
// them right away, exactly like product price changes do.
function revalidateStorefront() {
  revalidatePath("/admin/promotions");
  revalidatePath("/[locale]", "layout");
}

export async function createPromotion(formData: FormData) {
  await requireAdmin();
  const { fields, productIds, collectionIds } = readPromotionFields(formData);

  await prisma.promotion.create({
    data: {
      ...fields,
      products: { connect: productIds.map((id) => ({ id })) },
      collections: { connect: collectionIds.map((id) => ({ id })) },
    },
  });

  revalidateStorefront();
  redirect("/admin/promotions");
}

export async function updatePromotion(id: string, formData: FormData) {
  await requireAdmin();
  const { fields, productIds, collectionIds } = readPromotionFields(formData);

  await prisma.promotion.update({
    where: { id },
    data: {
      ...fields,
      // `set` replaces the links, so switching scope clears the old ones.
      products: { set: productIds.map((productId) => ({ id: productId })) },
      collections: {
        set: collectionIds.map((collectionId) => ({ id: collectionId })),
      },
    },
  });

  revalidateStorefront();
  redirect("/admin/promotions");
}

export async function setPromotionActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.promotion.update({ where: { id }, data: { isActive } });
  revalidateStorefront();
}

export async function deletePromotion(id: string) {
  await requireAdmin();
  await prisma.promotion.delete({ where: { id } });
  revalidateStorefront();
}
