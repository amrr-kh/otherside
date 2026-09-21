"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { PriceDisplay } from "./PriceDisplay";
import { getPercentOff } from "@/lib/pricing";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  colors: string[];
  colorHexes?: (string | null)[];
  primaryImageUrl?: string | null;
  secondaryImageUrl?: string | null;
  colorSlug?: string;
};

const MAX_DOTS = 5;

function ColorDot({ hex }: { hex: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3 w-3 shrink-0 rounded-full ring-1 ring-current/30"
      style={{ backgroundColor: hex }}
    />
  );
}

/** Colour indicators: swatch dots when the colours have one, plain text otherwise. */
function ColorIndicators({ product }: { product: ProductCardData }) {
  const t = useTranslations("productCard");
  const { colors, colorHexes } = product;
  if (colors.length === 0) return null;

  const hasSwatches =
    !!colorHexes &&
    colorHexes.length === colors.length &&
    colorHexes.every((hex) => Boolean(hex));

  if (colors.length === 1) {
    return (
      <p className="mt-2 flex items-center gap-2 text-xs opacity-60">
        {hasSwatches ? <ColorDot hex={colorHexes![0]!} /> : null}
        {colors[0]}
      </p>
    );
  }

  if (!hasSwatches) {
    return (
      <p className="mt-2 text-xs opacity-60">
        {t("colorsCount", { count: colors.length })}
      </p>
    );
  }

  const shown = colorHexes!.slice(0, MAX_DOTS);
  const extra = colors.length - shown.length;
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs opacity-70">
      <span className="sr-only">{colors.join(", ")}</span>
      {shown.map((hex, i) => (
        <ColorDot key={`${hex}-${i}`} hex={hex!} />
      ))}
      {extra > 0 ? <span aria-hidden="true">+{extra}</span> : null}
    </p>
  );
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const tp = useTranslations("price");
  const percentOff = getPercentOff(product.price, product.compareAtPrice);
  const [hovered, setHovered] = useState(false);
  const hasPhoto = Boolean(product.primaryImageUrl);
  const href = product.colorSlug
    ? `/products/${product.slug}?color=${product.colorSlug}`
    : `/products/${product.slug}`;

  return (
    <Link
      href={href}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-soft-black">
        {hasPhoto ? (
          <>
            <Image
              src={product.primaryImageUrl!}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className={`object-cover object-[50%_18%] transition-opacity duration-500 ${
                hovered ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src={product.secondaryImageUrl ?? product.primaryImageUrl!}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className={`object-cover object-[50%_18%] transition-opacity duration-500 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <>
            <PlaceholderPhoto
              variant="product"
              className={`absolute inset-0 transition-opacity duration-500 ${
                hovered ? "opacity-0" : "opacity-100"
              }`}
            />
            <PlaceholderPhoto
              variant="lifestyle"
              className={`absolute inset-0 transition-opacity duration-500 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        )}
        {percentOff !== null ? (
          <span className="absolute start-3 top-3 bg-os-burgundy px-2.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-os-cream">
            {tp("save", { percent: percentOff })}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <h3 className="text-sm">{product.name}</h3>
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          variant="card"
          className="mt-1.5"
        />
        <ColorIndicators product={product} />
      </div>
    </Link>
  );
}
