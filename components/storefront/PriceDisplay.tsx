import { useTranslations } from "next-intl";
import {
  formatEgp,
  getPercentOff,
  normalizeCompareAtPrice,
} from "@/lib/pricing";

type Props = {
  price: number;
  compareAtPrice?: number | null;
  /** "card" lays prices out inline for grid cells; "detail" is the product page; "line" stacks them for cart rows. */
  variant?: "card" | "detail" | "line";
  showBadge?: boolean;
  className?: string;
};

// Colour comes from the surrounding section (dark or light), so prices read
// correctly on either background. The original price is struck through (a
// line through the number, never an underline) and dimmed.
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
        className={`whitespace-nowrap ${
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
        <span className="text-2xl">
          <span className="sr-only">{t("sale")}: </span>
          {formatEgp(price)}
        </span>
        <s className="text-base opacity-50">
          <span className="sr-only">{t("original")}: </span>
          {formatEgp(original)}
        </s>
        {showBadge && percentOff !== null ? (
          <span className="bg-os-burgundy px-2 py-1 text-[11px] uppercase tracking-[0.15em] text-os-cream">
            {t("save", { percent: percentOff })}
          </span>
        ) : null}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <span
        className={`flex flex-wrap items-baseline gap-x-2.5 whitespace-nowrap ${className}`}
      >
        <span className="text-sm">
          <span className="sr-only">{t("sale")}: </span>
          {formatEgp(price)}
        </span>
        <s className="text-xs opacity-50">
          <span className="sr-only">{t("original")}: </span>
          {formatEgp(original)}
        </s>
      </span>
    );
  }

  // "line": right-aligned stack for cart / checkout rows.
  return (
    <span
      className={`flex flex-col items-end gap-0.5 whitespace-nowrap ${className}`}
    >
      <span className="text-sm">
        <span className="sr-only">{t("sale")}: </span>
        {formatEgp(price)}
      </span>
      <s className="text-xs opacity-50">
        <span className="sr-only">{t("original")}: </span>
        {formatEgp(original)}
      </s>
    </span>
  );
}
