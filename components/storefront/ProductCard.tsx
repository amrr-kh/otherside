"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { PlaceholderPhoto } from "./PlaceholderPhoto";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  colors: string[];
  primaryImageUrl?: string | null;
  secondaryImageUrl?: string | null;
  colorSlug?: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
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
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-warm-white/80 backdrop-blur transition-colors hover:text-magenta"
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
        <span className="whitespace-nowrap text-sm text-gold">
          EGP {product.price.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
