/**
 * Display-only helpers. Checkout/cart totals are always computed on the
 * server from database prices — nothing here feeds into a charged amount.
 */

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
