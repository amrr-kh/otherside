"use client";

import type { PromotionView } from "@/lib/promotion-shared";
import { CountdownDigits } from "./CountdownDigits";
import {
  usePercentBadge,
  usePromotionLabels,
  usePromotionPriceRefresh,
  usePromotionState,
} from "./usePromotionState";

/**
 * A small version of the countdown for a product page, shown only when the
 * promotion applies to that product. The top bar stays the primary countdown;
 * this is deliberately quiet and does not touch the price or the Add to Bag
 * controls.
 */
export function PromotionProductTimer({
  promotion,
  className = "",
}: {
  promotion: PromotionView;
  className?: string;
}) {
  const { phase, parts } = usePromotionState(promotion);
  const labels = usePromotionLabels();
  const percentBadge = usePercentBadge(promotion);
  usePromotionPriceRefresh(promotion);

  if (phase !== "live") return null;

  return (
    // No landmark role here: the top bar is already the page's offer region, and
    // two regions with the same name confuse screen-reader navigation. The fixed
    // deadline sentence below is still available to assistive tech.
    <div
      className={`border border-copper/25 bg-burgundy-deep/40 px-4 py-3 ${className}`}
    >
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] uppercase tracking-[0.16em] text-copper-light">
        <span className="whitespace-nowrap">{labels.productEndsIn}</span>
        {percentBadge ? (
          <span className="whitespace-nowrap border border-copper/60 px-1.5 py-0.5 text-[9px] font-medium leading-none tracking-[0.14em] text-warm-white">
            {percentBadge}
          </span>
        ) : null}
      </p>
      <CountdownDigits
        parts={parts}
        labels={labels}
        className="mt-2"
        digitClassName="text-sm"
      />
      <p className="sr-only">{promotion.endsLabel}</p>
    </div>
  );
}
