"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export type SubmitReviewState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export async function submitReview(
  productId: string,
  productSlug: string,
  _prevState: SubmitReviewState,
  formData: FormData,
): Promise<SubmitReviewState> {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim();

  if (!customerName || !body) {
    return { status: "error", message: "missingFields" };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "invalidRating" };
  }
  if (customerName.length > 80 || body.length > 2000) {
    return { status: "error", message: "tooLong" };
  }

  await prisma.review.create({
    data: {
      productId,
      customerName,
      rating,
      body,
      isApproved: false,
      isDemo: false,
    },
  });

  revalidatePath(`/products/${productSlug}`);
  return { status: "success" };
}
