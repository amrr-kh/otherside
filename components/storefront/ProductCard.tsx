"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
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
  primaryImageUrl?: string | null;
  secondaryImageUrl?: string | null;
  colorSlug?: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const t = useTranslations("productCard");
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
      <div className="relative aspect-[3/4] overflow-hidden bg-soft-black">
        {hasPhoto ? (
          <>
            <Image
              src={product.primaryImageUrl!}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className={`object-cover transition-opacity duration-500 ${
                hovered ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src={product.secondaryImageUrl ?? product.primaryImageUrl!}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className={`object-cover transition-opacity duration-500 ${
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
          <span className="absolute start-3 top-3 bg-bg/85 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-gold backdrop-blur">
            {tp("save", { percent: percentOff })}
          </span>
        ) : null}
        <button
          type="button"
          aria-label={t("addToWishlist")}
          onClick={(e) => e.preventDefault()}
          className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-warm-white/80 backdrop-blur transition-colors hover:text-magenta"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm text-warm-white">{product.name}</h3>
          <p className="mt-1 text-xs text-warm-white/45">
            {product.colors.join(" / ")}
          </p>
        </div>
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          variant="card"
        />
      </div>
    </Link>
  );
}
