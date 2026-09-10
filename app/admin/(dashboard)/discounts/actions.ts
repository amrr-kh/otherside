"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import type { DiscountType } from "@/generated/prisma/enums";

export async function createDiscountCode(formData: FormData) {
  await requireAdmin();

  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();
  const type = String(formData.get("type") ?? "") as DiscountType;
  const value = Number(formData.get("value"));
  const minSubtotalRaw = String(formData.get("minSubtotal") ?? "").trim();
  const minSubtotal = minSubtotalRaw ? Number(minSubtotalRaw) : null;
  const expiresAtRaw = String(formData.get("expiresAt") ?? "").trim();
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;
  const usageLimitRaw = String(formData.get("usageLimit") ?? "").trim();
  const usageLimit = usageLimitRaw ? Number(usageLimitRaw) : null;

  if (!code) throw new Error("Code is required.");
  if (type !== "PERCENT" && type !== "FIXED") {
    throw new Error("Invalid discount type.");
  }
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Value must be a positive number.");
  }
  if (type === "PERCENT" && value > 100) {
    throw new Error("Percent discount can't exceed 100.");
  }
  if (minSubtotal !== null && (!Number.isFinite(minSubtotal) || minSubtotal < 0)) {
    throw new Error("Minimum subtotal must be a valid non-negative number.");
  }
  if (usageLimit !== null && (!Number.isInteger(usageLimit) || usageLimit <= 0)) {
    throw new Error("Usage limit must be a positive whole number.");
  }

  await prisma.discountCode.create({
    data: { code, type, value, minSubtotal, expiresAt, usageLimit },
  });

  revalidatePath("/admin/discounts");
}

export async function toggleDiscountCode(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.discountCode.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/discounts");
}

export async function deleteDiscountCode(id: string) {
  await requireAdmin();
  await prisma.discountCode.delete({ where: { id } });
  revalidatePath("/admin/discounts");
}
