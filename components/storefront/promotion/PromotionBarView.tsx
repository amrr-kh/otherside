import type { ReactNode } from "react";
import type { CountdownParts } from "@/lib/promotion-shared";
import { CountdownDigits, type CountdownLabels } from "./CountdownDigits";

/**
 * The announcement bar's markup, with no hooks and no i18n, so the storefront
 * bar and the admin preview render exactly the same design. The CTA arrives as
 * a ready-made node because a real link needs the storefront's locale-aware
 * router, which the admin panel does not have.
 *
 * Desktop: one horizontal row: TITLE [20% OFF] — ENDS IN  02 DAYS : 14 HRS : ...  MESSAGE  CTA
 * Mobile: two slim lines. Line 1 is the headline and the CTA (each can
 * truncate, so nothing overflows), line 2 is "ENDS IN 02D 14H 36M 18S". The
 * long message is dropped to save height.
 */
export function PromotionBarView({
  title,
  percentBadge = null,
  message,
  endsInLabel,
  endsLabel,
  parts,
  labels,
  cta,
}: {
  title: string;
  /** e.g. "20% OFF" when the offer also lowers prices. */
  percentBadge?: string | null;
  message: string | null;
  endsInLabel: string;
  endsLabel: string;
  parts: CountdownParts | null;
  labels: CountdownLabels;
  cta: ReactNode;
}) {
  return (
    <div
      role="region"
      aria-label={title}
      className="border-b border-copper/30 bg-burgundy-deep text-warm-white"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-1.5 px-4 py-2.5 md:flex-row md:items-center md:justify-center md:gap-7 md:px-10">
        {/* Mobile line 1. On desktop this wrapper disappears (display: contents)
            so its children join the single row and are placed by `order`. */}
        <div className="flex items-center justify-between gap-3 md:contents">
          <p className="flex min-w-0 flex-1 items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-copper-light md:order-1 md:flex-none md:text-[11px] md:tracking-[0.22em]">
            <span className="truncate">{title}</span>
            {percentBadge ? (
              <span className="shrink-0 whitespace-nowrap border border-copper/60 px-1.5 py-0.5 text-[9px] font-medium leading-none tracking-[0.14em] text-warm-white">
                {percentBadge}
              </span>
            ) : null}
          </p>

          <div className="max-w-[55%] shrink-0 text-[10px] font-medium uppercase tracking-[0.1em] md:order-4 md:max-w-none md:text-[11px] md:tracking-[0.18em]">
            {cta}
          </div>
        </div>

        {/* Mobile line 2 / desktop middle. */}
        <div className="flex items-center justify-center gap-2.5 md:order-2 md:justify-start">
          <span
            aria-hidden="true"
            className="hidden text-[11px] text-warm-white/30 md:inline"
          >
            —
          </span>
          <span className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-warm-white/70 md:text-[11px]">
            {endsInLabel}
          </span>
          <CountdownDigits parts={parts} labels={labels} />
        </div>

        {message ? (
          <p className="hidden max-w-md truncate font-display text-sm italic text-warm-white/80 md:order-3 lg:block">
            {message}
          </p>
        ) : null}
      </div>

      {/* The one thing assistive tech reads: a fixed deadline, not a ticking number. */}
      <p className="sr-only">{endsLabel}</p>
    </div>
  );
}
