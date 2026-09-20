import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { formatCairoDeadline } from "@/lib/cairo-time";
import {
  phaseAt,
  promotionAppliesToProduct,
  type PromotionView,
} from "@/lib/promotion-shared";

type ActivePromotion = {
  id: string;
  title: string;
  message: string | null;
  ctaText: string;
  ctaUrl: string;
  titleAr: string | null;
  messageAr: string | null;
  ctaTextAr: string | null;
  discountPercent: number | null;
  startsAt: Date;
  endsAt: Date;
  showTopBar: boolean;
  showOnProductPages: boolean;
  scope: "STORE" | "COLLECTIONS" | "PRODUCTS";
  productIds: string[];
  collectionIds: string[];
};

/**
 * Every promotion an admin has switched on that has not already ended, live
 * ones first (soonest ending first), then upcoming ones (soonest starting
 * first). The exact start/end check happens again in the browser against the
 * real clock, so a page rendered a moment ago never shows a stale state.
 *
 * Fails soft: if the table is missing or the database hiccups, the storefront
 * simply shows no promotion instead of breaking every page.
 */
export const getActivePromotions = cache(
  async (): Promise<ActivePromotion[]> => {
    try {
      const now = new Date();
      const rows = await prisma.promotion.findMany({
        where: { isActive: true, endsAt: { gt: now } },
        include: {
          products: { select: { id: true } },
          collections: { select: { id: true } },
        },
      });

      const list = rows.map((row) => ({
        id: row.id,
        title: row.title,
        message: row.message,
        ctaText: row.ctaText,
        ctaUrl: row.ctaUrl,
        titleAr: row.titleAr,
        messageAr: row.messageAr,
        ctaTextAr: row.ctaTextAr,
        discountPercent: row.discountPercent,
        startsAt: row.startsAt,
        endsAt: row.endsAt,
        showTopBar: row.showTopBar,
        showOnProductPages: row.showOnProductPages,
        scope: row.scope,
        productIds: row.products.map((p) => p.id),
        collectionIds: row.collections.map((c) => c.id),
      }));

      const nowMs = now.getTime();
      const isLive = (p: ActivePromotion) => p.startsAt.getTime() <= nowMs;
      return list.sort((a, b) => {
        if (isLive(a) !== isLive(b)) return isLive(a) ? -1 : 1;
        return isLive(a)
          ? a.endsAt.getTime() - b.endsAt.getTime()
          : a.startsAt.getTime() - b.startsAt.getTime();
      });
    } catch (error) {
      console.error("getActivePromotions: failed to load", error);
      return [];
    }
  },
);

/** Arabic copy when the admin wrote it and the page is Arabic; English otherwise. */
export function toPromotionView(
  promotion: ActivePromotion,
  locale: string,
  endsLabelTemplate: (when: string) => string,
  options: { siteWideBar?: boolean } = {},
): PromotionView {
  const ar = locale === "ar";
  const nowMs = Date.now();
  return {
    id: promotion.id,
    title: (ar && promotion.titleAr) || promotion.title,
    message: (ar && promotion.messageAr) || promotion.message,
    ctaText: (ar && promotion.ctaTextAr) || promotion.ctaText,
    ctaUrl: promotion.ctaUrl,
    discountPercent: promotion.discountPercent,
    badgePercent:
      options.siteWideBar && promotion.scope !== "STORE"
        ? null
        : promotion.discountPercent,
    startsAt: promotion.startsAt.toISOString(),
    endsAt: promotion.endsAt.toISOString(),
    endsLabel: endsLabelTemplate(formatCairoDeadline(promotion.endsAt, locale)),
    phase: phaseAt(
      promotion.startsAt.getTime(),
      promotion.endsAt.getTime(),
      nowMs,
    ),
  };
}

/**
 * Of several candidate offers, the one to show. Offers already running beat
 * ones that have not started; among those, the biggest percentage wins (it is
 * also the one that actually sets the price, see bestPercentPromotion), and
 * ties go to the one that ends soonest (the incoming order).
 */
function bestOffer(candidates: ActivePromotion[]): ActivePromotion | null {
  const now = Date.now();
  const running = candidates.filter((p) => p.startsAt.getTime() <= now);
  const pool = running.length > 0 ? running : candidates;
  return pool.reduce<ActivePromotion | null>(
    (best, p) =>
      best === null || (p.discountPercent ?? -1) > (best.discountPercent ?? -1)
        ? p
        : best,
    null,
  );
}

export function pickTopBarPromotion(list: ActivePromotion[]) {
  // The bar is site-wide, so an offer that covers the whole store speaks for
  // the whole site; only fall back to a partial offer when there is none.
  const candidates = list.filter((p) => p.showTopBar);
  const storeWide = candidates.filter((p) => p.scope === "STORE");
  return bestOffer(storeWide.length > 0 ? storeWide : candidates);
}

export function pickProductPromotion(
  list: ActivePromotion[],
  product: { productId: string; collectionIds: string[] },
) {
  return bestOffer(
    list.filter(
      (p) => p.showOnProductPages && promotionAppliesToProduct(p, product),
    ),
  );
}
