"use server";

import { prisma } from "@/lib/db";
import type { DiscountType } from "@/generated/prisma/enums";

export type PromoCheckResult =
  | {
      valid: true;
      code: string;
      type: DiscountType;
      value: number;
      discountAmount: number;
    }
  | { valid: false; message: string };

// Live preview only — placeOrder always re-validates and recomputes the
// discount server-side before it's ever applied to a real order.
export async function checkPromoCode(
  rawCode: string,
  subtotal: number,
): Promise<PromoCheckResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, message: "empty" };

  const discount = await prisma.discountCode.findUnique({ where: { code } });
  if (!discount || !discount.isActive) {
    return { valid: false, message: "notFound" };
  }
  if (discount.expiresAt && discount.expiresAt < new Date()) {
    return { valid: false, message: "expired" };
  }
  if (discount.usageLimit !== null && discount.timesUsed >= discount.usageLimit) {
    return { valid: false, message: "usedUp" };
  }
  if (discount.minSubtotal && subtotal < Number(discount.minSubtotal)) {
    return { valid: false, message: "minSubtotal" };
  }

  const value = Number(discount.value);
  const discountAmount =
    discount.type === "PERCENT"
      ? Math.round(subtotal * (value / 100) * 100) / 100
      : Math.min(value, subtotal);

  return { valid: true, code, type: discount.type, value, discountAmount };
}
