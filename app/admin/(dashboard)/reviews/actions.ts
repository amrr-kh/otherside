"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function approveReview(reviewId: string) {
  await requireAdmin();
  await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: true },
  });
  revalidatePath("/admin/reviews");
}

export async function unapproveReview(reviewId: string) {
  await requireAdmin();
  await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: false },
  });
  revalidatePath("/admin/reviews");
}

export async function deleteReview(reviewId: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id: reviewId } });
  revalidatePath("/admin/reviews");
}
