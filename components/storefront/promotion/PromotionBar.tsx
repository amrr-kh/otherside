"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { PromotionView } from "@/lib/promotion-shared";
import { PromotionBarView } from "./PromotionBarView";
import {
  usePercentBadge,
  usePromotionLabels,
  usePromotionPriceRefresh,
  usePromotionState,
} from "./usePromotionState";

const ctaClass =
  "group inline-flex max-w-full items-center gap-1.5 text-warm-white transition-colors hover:text-copper-light";

function Arrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
    />
  );
}

/**
 * The slim top-of-site countdown. The deadline comes from the database via the
 * page; the ticking is client-side arithmetic on a shared clock, so there is
 * no per-second request and no re-render outside this component.
 */
export function PromotionBar({ promotion }: { promotion: PromotionView }) {
  const { phase, parts } = usePromotionState(promotion);
  const labels = usePromotionLabels();
  const percentBadge = usePercentBadge(promotion);
  usePromotionPriceRefresh(promotion);

  // Not started yet, or the deadline has passed: show nothing (never a
  // negative number, never a restarted timer).
  if (phase !== "live") return null;

  const external = /^https?:\/\//i.test(promotion.ctaUrl);
  const cta = external ? (
    <a href={promotion.ctaUrl} className={ctaClass}>
      <span className="truncate">{promotion.ctaText}</span>
      <Arrow />
    </a>
  ) : (
    <Link href={promotion.ctaUrl} className={ctaClass}>
      <span className="truncate">{promotion.ctaText}</span>
      <Arrow />
    </Link>
  );

  return (
    <PromotionBarView
      title={promotion.title}
      percentBadge={percentBadge}
      message={promotion.message}
      endsInLabel={labels.endsIn}
      endsLabel={promotion.endsLabel}
      parts={parts}
      labels={labels}
      cta={cta}
    />
  );
}
