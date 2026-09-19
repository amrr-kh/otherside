/**
 * Price helpers. Display code and checkout share applyPercentOff so a
 * limited-offer percentage can never show one price and charge another;
 * cart/checkout totals are still always computed on the server from database
 * prices.
 */

/**
 * A price after a whole-number percent off, rounded to whole EGP (so what is
 * displayed is exactly what is charged, with no stray piasters). Never below 1.
 */
export function applyPercentOff(price: number, percent: number | null): number {
  if (percent === null || !Number.isFinite(percent) || percent <= 0) return price;
  const reduced = Math.round((price * (100 - percent)) / 100);
  return Math.min(price, Math.max(1, reduced));
}

/**
 * The prices to show and charge for a product while a percent-off offer may be
 * live. The struck-through "old" price is the product's own higher original
 * price when it has one (its regular sale still stands), otherwise the price
 * before the percentage. With no percent this returns the normal pair.
 */
export function pricingWithPercent(
  price: number,
  compareAtPrice: number | null | undefined,
  percent: number | null,
): { price: number; compareAtPrice: number | null } {
  const original = normalizeCompareAtPrice(price, compareAtPrice);
  const discounted = applyPercentOff(price, percent);
  if (discounted >= price) return { price, compareAtPrice: original };
  return { price: discounted, compareAtPrice: original ?? price };
}

/** Returns the original price only when it is a real, higher price. */
export function normalizeCompareAtPrice(
  price: number,
  compareAtPrice: number | null | undefined,
): number | null {
  if (compareAtPrice == null) return null;
  if (!Number.isFinite(compareAtPrice) || !Number.isFinite(price)) return null;
  return compareAtPrice > price ? compareAtPrice : null;
}

/** Whole-number percent saved, or null when there is no real discount. */
export function getPercentOff(
  price: number,
  compareAtPrice: number | null | undefined,
): number | null {
  const original = normalizeCompareAtPrice(price, compareAtPrice);
  if (original === null) return null;
  const percent = Math.round(((original - price) / original) * 100);
  return percent >= 1 ? percent : null;
}

export function formatEgp(amount: number): string {
  // Fixed locale so server and browser render identical digits.
  return `EGP ${amount.toLocaleString("en-US")}`;
}
