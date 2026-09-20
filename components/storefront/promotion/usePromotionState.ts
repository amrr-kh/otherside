"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  phaseAt,
  splitRemaining,
  type CountdownParts,
  type PromotionPhase,
  type PromotionView,
} from "@/lib/promotion-shared";
import type { CountdownLabels } from "./CountdownDigits";
import { usePromotionClock } from "./usePromotionClock";

/**
 * Until the clock is aligned with the server, trust the phase the server
 * rendered and show placeholders. After that, everything comes from the
 * database deadline and the aligned clock: before the start or after the end
 * the promotion is simply not shown, and the numbers can never go negative.
 */
export function usePromotionState(promotion: PromotionView): {
  phase: PromotionPhase;
  parts: CountdownParts | null;
} {
  const clock = usePromotionClock();
  if (!clock || !clock.synced) {
    return { phase: promotion.phase, parts: null };
  }
  const startsAt = Date.parse(promotion.startsAt);
  const endsAt = Date.parse(promotion.endsAt);
  return {
    phase: phaseAt(startsAt, endsAt, clock.now),
    parts: splitRemaining(endsAt - clock.now),
  };
}

/**
 * A percent-off offer changes prices the moment it starts or ends. If that
 * happens while a page is open, ask the server for fresh data once, so the
 * prices on screen match what checkout will charge.
 */
export function usePromotionPriceRefresh(promotion: PromotionView) {
  const router = useRouter();
  const { phase } = usePromotionState(promotion);
  const lastPhase = useRef(promotion.phase);
  useEffect(() => {
    if (lastPhase.current === phase) return;
    lastPhase.current = phase;
    if (promotion.discountPercent !== null) router.refresh();
  }, [phase, promotion.discountPercent, router]);
}

export function usePromotionLabels(): CountdownLabels & {
  endsIn: string;
  productEndsIn: string;
} {
  const t = useTranslations("promotion");
  return {
    endsIn: t("endsIn"),
    productEndsIn: t("productEndsIn"),
    days: t("days"),
    hours: t("hours"),
    minutes: t("minutes"),
    seconds: t("seconds"),
    daysShort: t("daysShort"),
    hoursShort: t("hoursShort"),
    minutesShort: t("minutesShort"),
    secondsShort: t("secondsShort"),
  };
}

/** "20% OFF" (or the Arabic form) when the offer lowers prices, otherwise null. */
export function usePercentBadge(promotion: PromotionView): string | null {
  const t = useTranslations("promotion");
  return promotion.badgePercent === null
    ? null
    : t("percentOff", { percent: promotion.badgePercent });
}
