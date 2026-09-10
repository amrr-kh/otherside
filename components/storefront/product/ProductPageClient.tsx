"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { slugify } from "@/lib/slug";
import { toggleWishlist } from "@/lib/actions/wishlist";
import { addToCart } from "@/lib/actions/cart";
import type { ProductDetail } from "./types";

export function ProductPageClient({
  product,
  initialColorParam,
  initialSizeParam,
  initiallyWishlisted,
}: {
  product: ProductDetail;
  initialColorParam?: string;
  initialSizeParam?: string;
  initiallyWishlisted: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [selectedColorId, setSelectedColorId] = useState(
    () =>
      product.colors.find((c) => slugify(c.value) === initialColorParam)?.id ??
      product.colors[0]?.id,
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string | undefined>(
    () =>
      product.sizes.find((s) => slugify(s.value) === initialSizeParam)?.id,
  );
  const [activeImageId, setActiveImageId] = useState<string | undefined>();
  const [wishlisted, setWishlisted] = useState(initiallyWishlisted);
  const [quantity, setQuantity] = useState(1);
  const [addedToBag, setAddedToBag] = useState(false);

  const colorImages = useMemo(
    () =>
      product.images
        .filter((img) => img.colorOptionValueId === selectedColorId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [product.images, selectedColorId],
  );

  const frontImage = colorImages.find((i) => i.role === "FRONT") ?? colorImages[0];
  const backImage = colorImages.find((i) => i.role === "BACK");
  const displayedImage =
    colorImages.find((i) => i.id === activeImageId) ?? frontImage;

  const availableSizeIds = useMemo(() => {
    return new Set(
      product.variants
        .filter((v) => v.colorId === selectedColorId && v.quantity > 0)
        .map((v) => v.sizeId),
    );
  }, [product.variants, selectedColorId]);

  const selectedVariant = product.variants.find(
    (v) => v.colorId === selectedColorId && v.sizeId === selectedSizeId,
  );
  const canAddToBag = Boolean(
    selectedVariant && selectedSizeId && availableSizeIds.has(selectedSizeId),
  );

  function updateUrl(colorId: string | undefined, sizeId: string | undefined) {
    const color = product.colors.find((c) => c.id === colorId);
    const size = product.sizes.find((s) => s.id === sizeId);
    const params = new URLSearchParams();
    if (color) params.set("color", slugify(color.value));
    if (size) params.set("size", slugify(size.value));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleColorSelect(colorId: string) {
    setSelectedColorId(colorId);
    setActiveImageId(undefined);
    const stillAvailable =
      selectedSizeId &&
      product.variants.some(
        (v) => v.colorId === colorId && v.sizeId === selectedSizeId && v.quantity > 0,
      );
    const nextSizeId = stillAvailable ? selectedSizeId : undefined;
    setSelectedSizeId(nextSizeId);
    updateUrl(colorId, nextSizeId);
  }

  function handleSizeSelect(sizeId: string) {
    if (!availableSizeIds.has(sizeId)) return;
    setSelectedSizeId(sizeId);
    updateUrl(selectedColorId, sizeId);
  }

  function handleWishlist() {
    setWishlisted((w) => !w);
    startTransition(async () => {
      try {
        await toggleWishlist(product.id, pathname);
      } catch {
        setWishlisted((w) => !w);
      }
    });
  }

  function handleAddToBag() {
    if (!selectedVariant) return;
    startTransition(async () => {
      await addToCart(selectedVariant.id, quantity);
      setAddedToBag(true);
      setTimeout(() => setAddedToBag(false), 2500);
    });
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-10 md:py-14">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-soft-black">
            {displayedImage ? (
              <Image
                key={displayedImage.id}
                src={displayedImage.url}
                alt={product.name}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-opacity duration-300"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-warm-white/30">
                No photos yet
              </div>
            )}
          </div>

          {(frontImage || backImage) && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveImageId(frontImage?.id)}
                className={`border px-4 py-2 text-xs uppercase tracking-[0.15em] ${
                  displayedImage?.id === frontImage?.id
                    ? "border-warm-white text-warm-white"
                    : "border-warm-white/25 text-warm-white/50"
                }`}
              >
                Front
              </button>
              {backImage ? (
                <button
                  type="button"
                  onClick={() => setActiveImageId(backImage.id)}
                  className={`border px-4 py-2 text-xs uppercase tracking-[0.15em] ${
                    displayedImage?.id === backImage.id
                      ? "border-warm-white text-warm-white"
                      : "border-warm-white/25 text-warm-white/50"
                  }`}
                >
                  Other Side
                </button>
              ) : null}
            </div>
          )}

          {colorImages.length > 2 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {colorImages.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImageId(img.id)}
                  className={`relative aspect-[3/4] overflow-hidden ring-1 ${
                    displayedImage?.id === img.id
                      ? "ring-warm-white"
                      : "ring-warm-white/15"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`${product.name} ${img.role.toLowerCase()}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase panel */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
            OtherSide essentials
          </p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="font-display text-4xl italic text-warm-white md:text-5xl">
              {product.name}
            </h1>
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="mt-2 shrink-0 text-warm-white/70 transition-colors hover:text-magenta"
            >
              <Heart
                className="h-6 w-6"
                fill={wishlisted ? "currentColor" : "none"}
                color={wishlisted ? "var(--color-magenta)" : "currentColor"}
              />
            </button>
          </div>

          <p className="mt-3 text-xl text-gold">
            EGP {product.price.toLocaleString()}
          </p>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-warm-white/60">
            {product.shortDescription}
          </p>

          {/* Colors */}
          <div className="mt-8">
            <h2 className="text-xs uppercase tracking-[0.15em] text-warm-white/60">
              Color
              {(() => {
                const c = product.colors.find((c) => c.id === selectedColorId);
                return c ? (
                  <span className="ml-2 normal-case text-warm-white/40">
                    {c.value}
                  </span>
                ) : null;
              })()}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleColorSelect(color.id)}
                  className={`border px-4 py-2 text-xs uppercase tracking-[0.1em] transition-colors ${
                    selectedColorId === color.id
                      ? "border-warm-white text-warm-white"
                      : "border-warm-white/25 text-warm-white/55 hover:border-warm-white/60"
                  }`}
                >
                  {color.value}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <h2 className="text-xs uppercase tracking-[0.15em] text-warm-white/60">
              Size
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const available = availableSizeIds.has(size.id);
                const selected = selectedSizeId === size.id;
                return (
                  <button
                    key={size.id}
                    type="button"
                    disabled={!available}
                    onClick={() => handleSizeSelect(size.id)}
                    className={`flex h-11 w-11 items-center justify-center border text-xs uppercase transition-colors ${
                      selected
                        ? "border-warm-white text-warm-white"
                        : available
                          ? "border-warm-white/25 text-warm-white/70 hover:border-warm-white/60"
                          : "cursor-not-allowed border-warm-white/10 text-warm-white/20 line-through"
                    }`}
                  >
                    {size.value}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-warm-white/10 pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-warm-white/25">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-warm-white/70 hover:text-warm-white"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm text-warm-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-warm-white/70 hover:text-warm-white"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={!canAddToBag || isPending}
                onClick={handleAddToBag}
                className="flex flex-1 items-center justify-center gap-2 bg-warm-white px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-warm-white/15 disabled:text-warm-white/40"
              >
                <ShoppingBag className="h-4 w-4" />
                {addedToBag
                  ? "Added to Bag"
                  : canAddToBag
                    ? "Add to Bag"
                    : "Select a Size"}
              </button>
            </div>
          </div>

          <div className="mt-10 divide-y divide-warm-white/10 border-t border-warm-white/10">
            <DetailSection title="Description">
              {product.fullDescription}
            </DetailSection>
            {product.fit ? (
              <DetailSection title="Fit">{product.fit}</DetailSection>
            ) : null}
            {product.material ? (
              <DetailSection title="Material">{product.material}</DetailSection>
            ) : null}
            {product.care ? (
              <DetailSection title="Care">{product.care}</DetailSection>
            ) : null}
            <DetailSection title="Shipping">
              Calculated at checkout based on your governorate. Cash on
              delivery across Egypt.
            </DetailSection>
            <DetailSection title="Returns">
              Unworn items in original condition can be returned within 14
              days of delivery.
            </DetailSection>
            <DetailSection title="Availability">
              {selectedVariant
                ? selectedVariant.quantity > 0
                  ? `In stock — ${selectedVariant.quantity} left`
                  : "Out of stock in this size"
                : "Select a color and size to check availability"}
            </DetailSection>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-warm-white">
        {title}
        <span className="text-warm-white/40 group-open:rotate-45">+</span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-warm-white/55">
        {children}
      </p>
    </details>
  );
}
