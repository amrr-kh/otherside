import { useTranslations } from "next-intl";
import {
  formatEgp,
  getPercentOff,
  normalizeCompareAtPrice,
} from "@/lib/pricing";

type Props = {
  price: number;
  compareAtPrice?: number | null;
  /** "card" stacks the prices for narrow grid cells; "detail" lays them out inline. */
  variant?: "card" | "detail" | "line";
  showBadge?: boolean;
  className?: string;
};

export function PriceDisplay({
  price,
  compareAtPrice,
  variant = "card",
  showBadge = false,
  className = "",
}: Props) {
  const t = useTranslations("price");
  const original = normalizeCompareAtPrice(price, compareAtPrice);
  const percentOff = getPercentOff(price, compareAtPrice);

  if (original === null) {
    return (
      <span
        className={`whitespace-nowrap text-gold ${
          variant === "detail" ? "text-xl" : "text-sm"
        } ${className}`}
      >
        {formatEgp(price)}
      </span>
    );
  }

  if (variant === "detail") {
    return (
      <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className}`}>
        <s className="text-base text-warm-white/50 decoration-warm-white/50">
          <span className="sr-only">{t("original")}: </span>
          {formatEgp(original)}
        </s>
        <span className="text-2xl font-semibold text-gold">
          <span className="sr-only">{t("sale")}: </span>
          {formatEgp(price)}
        </span>
        {showBadge && percentOff !== null ? (
          <span className="border border-gold/60 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
            {t("save", { percent: percentOff })}
          </span>
        ) : null}
      </div>
    );
  }

  // "card" and "line": right-aligned stack, sale price stronger than the original.
  return (
    <span
      className={`flex flex-col items-end gap-0.5 whitespace-nowrap ${className}`}
    >
      <span className="text-sm font-semibold text-gold">
        <span className="sr-only">{t("sale")}: </span>
        {formatEgp(price)}
      </span>
      <s className="text-xs text-warm-white/45 decoration-warm-white/45">
        <span className="sr-only">{t("original")}: </span>
        {formatEgp(original)}
      </s>
    </span>
  );
}
