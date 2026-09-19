import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { bestPercentPromotion } from "@/lib/promotion-shared";
import { applyPercentOff, pricingWithPercent } from "@/lib/pricing";

export type PercentPromotion = {
  scope: "STORE" | "COLLECTIONS" | "PRODUCTS";
  productIds: string[];
  collectionIds: string[];
  discountPercent: number;
  /** When this offer stops; used for structured data (priceValidUntil). */
  endsAt: Date;
};

/** Anything with a `promotion` delegate: the normal client or a transaction. */
type PromotionReader = Pick<typeof prisma, "promotion">;

/**
 * Percent-off offers that are live RIGHT NOW by the server's clock: switched
 * on, already started, not yet ended, and carrying a percentage.
 */
export async function fetchLivePercentPromotions(
  db: PromotionReader,
  now: Date = new Date(),
): Promise<PercentPromotion[]> {
  const rows = await db.promotion.findMany({
    where: {
      isActive: true,
      discountPercent: { not: null },
      startsAt: { lte: now },
      endsAt: { gt: now },
    },
    include: {
      products: { select: { id: true } },
      collections: { select: { id: true } },
    },
  });

  return rows.flatMap((row) =>
    row.discountPercent === null
      ? []
      : [
          {
            scope: row.scope,
            productIds: row.products.map((p) => p.id),
            collectionIds: row.collections.map((c) => c.id),
            discountPercent: row.discountPercent,
            endsAt: row.endsAt,
          },
        ],
  );
}

/**
 * One read per request for display code. Fails soft: if the promotions table
 * is missing or the database hiccups, prices simply show as normal.
 */
export const getLivePercentPromotions = cache(
  async (): Promise<PercentPromotion[]> => {
    try {
      return await fetchLivePercentPromotions(prisma);
    } catch (error) {
      console.error("getLivePercentPromotions: failed to load", error);
      return [];
    }
  },
);

/** The live offer that applies to a product (the biggest percent wins), or null. */
export function promotionFor(
  promotions: PercentPromotion[],
  product: { id: string; collections?: { id: string }[] },
): PercentPromotion | null {
  return bestPercentPromotion(promotions, {
    productId: product.id,
    collectionIds: (product.collections ?? []).map((c) => c.id),
  });
}

/** The percent off that applies to a product right now, or null. */
export function percentOffFor(
  promotions: PercentPromotion[],
  product: { id: string; collections?: { id: string }[] },
): number | null {
  return promotionFor(promotions, product)?.discountPercent ?? null;
}

/** The price pair to display for a product given the live offers. */
export function pricedForDisplay(
  promotions: PercentPromotion[],
  product: {
    id: string;
    collections?: { id: string }[];
    basePrice: unknown;
    compareAtPrice?: unknown;
  },
) {
  const promotion = promotionFor(promotions, product);
  const percent = promotion?.discountPercent ?? null;
  return {
    percent,
    /** When the offer price stops applying (null when there is no offer). */
    validUntil: promotion?.endsAt ?? null,
    ...pricingWithPercent(
      Number(product.basePrice),
      product.compareAtPrice == null ? null : Number(product.compareAtPrice),
      percent,
    ),
  };
}

/**
 * The unit price charged for each variant: the database price (the variant's
 * own override if it has one, else the product price), lowered by a live
 * limited-offer percentage when one covers that product. Checkout calls this
 * inside its transaction, so what is charged always follows the same rule the
 * cart and product pages display.
 */
export function unitPricesForVariants(
  variants: {
    id: string;
    priceOverride: unknown;
    product: {
      id: string;
      basePrice: unknown;
      collections?: { id: string }[];
    };
  }[],
  promotions: PercentPromotion[],
): Map<string, number> {
  return new Map(
    variants.map((variant) => [
      variant.id,
      applyPercentOff(
        Number(variant.priceOverride ?? variant.product.basePrice),
        percentOffFor(promotions, variant.product),
      ),
    ]),
  );
}
