// Pure helpers shared by the server (which decides what to render) and the
// client (which ticks the countdown). No server-only imports here.

export type PromotionPhase = "scheduled" | "live" | "ended";

/** What the storefront needs to render a promotion; safe to send to the browser. */
export type PromotionView = {
  id: string;
  title: string;
  message: string | null;
  ctaText: string;
  ctaUrl: string;
  /** Whole-number percent off while the offer is live, or null for a messaging-only offer. */
  discountPercent: number | null;
  /** ISO 8601 UTC instants: the database is the source of truth for both. */
  startsAt: string;
  endsAt: string;
  /** Fixed sentence for screen readers, e.g. "Limited offer ends September 23 at 11:59 PM Cairo time." */
  endsLabel: string;
  /** State when the server rendered the page; the client re-checks against the real clock. */
  phase: PromotionPhase;
};

export function phaseAt(
  startsAtMs: number,
  endsAtMs: number,
  nowMs: number,
): PromotionPhase {
  if (nowMs >= endsAtMs) return "ended";
  if (nowMs >= startsAtMs) return "live";
  return "scheduled";
}

export type CountdownParts = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Splits remaining milliseconds into padded parts. Never negative: it stops at 00. */
export function splitRemaining(remainingMs: number): CountdownParts {
  const total = Math.max(0, Math.floor(remainingMs / 1000));
  return {
    days: pad2(Math.floor(total / 86400)),
    hours: pad2(Math.floor((total % 86400) / 3600)),
    minutes: pad2(Math.floor((total % 3600) / 60)),
    seconds: pad2(total % 60),
  };
}

/**
 * A CTA may point to a page on this site ("/hoodies") or to an https URL.
 * Anything else (javascript:, data:, protocol-relative "//host", backslash
 * tricks) is rejected so an admin typo can never produce an unsafe link.
 */
export function isSafeCtaUrl(url: string): boolean {
  const value = url.trim();
  if (!value || value.length > 300) return false;
  if (/[\s\\]/.test(value)) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Of the live percent-off promotions that cover this product, the biggest
 * percentage wins. Offers never stack with each other.
 */
export function bestPercentPromotion<
  T extends {
    scope: "STORE" | "COLLECTIONS" | "PRODUCTS";
    productIds: string[];
    collectionIds: string[];
    discountPercent: number;
  },
>(
  promotions: T[],
  product: { productId: string; collectionIds: string[] },
): T | null {
  let best: T | null = null;
  for (const promotion of promotions) {
    if (!promotionAppliesToProduct(promotion, product)) continue;
    if (best === null || promotion.discountPercent > best.discountPercent) {
      best = promotion;
    }
  }
  return best;
}

/** Does a promotion with this scope apply to a given product? */
export function promotionAppliesToProduct(
  promotion: {
    scope: "STORE" | "COLLECTIONS" | "PRODUCTS";
    productIds: string[];
    collectionIds: string[];
  },
  product: { productId: string; collectionIds: string[] },
): boolean {
  switch (promotion.scope) {
    case "STORE":
      return true;
    case "PRODUCTS":
      return promotion.productIds.includes(product.productId);
    case "COLLECTIONS":
      return product.collectionIds.some((id) =>
        promotion.collectionIds.includes(id),
      );
  }
}
