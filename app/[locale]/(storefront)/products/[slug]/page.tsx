import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getWishlistProductIds } from "@/lib/storefront/wishlist";
import { ProductPageClient } from "@/components/storefront/product/ProductPageClient";
import type { ProductDetail } from "@/components/storefront/product/types";

export const revalidate = 60;

export default async function ProductPage({
  params,
  searchParams,
}: PageProps<"/[locale]/products/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;

  let product;
  let wishlistedIds: Set<string>;
  try {
    [product, wishlistedIds] = await Promise.all([
      prisma.product.findFirst({
        where: { slug, status: "ACTIVE" },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          options: { include: { values: { orderBy: { sortOrder: "asc" } } } },
          variants: { include: { optionValues: true, inventory: true } },
        },
      }),
      getWishlistProductIds(),
    ]);
  } catch (error) {
    console.error(`ProductPage(${slug}): failed to load`, error);
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
          One moment
        </p>
        <h1 className="mt-5 font-display text-3xl italic text-warm-white md:text-4xl">
          Having trouble loading this product.
        </h1>
        <p className="mt-4 max-w-sm text-sm text-warm-white/55">
          Please refresh in a moment.
        </p>
      </div>
    );
  }

  if (!product) notFound();

  const colorOption = product.options.find((o) => o.name === "Color");
  const sizeOption = product.options.find((o) => o.name === "Size");
  const colors = colorOption?.values ?? [];
  const sizes = sizeOption?.values ?? [];

  const detail: ProductDetail = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    price: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    material: product.material,
    fit: product.fit,
    care: product.care,
    colors: colors.map((c) => ({ id: c.id, value: c.value, swatchHex: c.swatchHex })),
    sizes: sizes.map((s) => ({ id: s.id, value: s.value })),
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      role: img.role,
      colorOptionValueId: img.colorOptionValueId,
      modelGender:
        img.modelGender === "MEN" || img.modelGender === "WOMEN"
          ? img.modelGender
          : null,
      sortOrder: img.sortOrder,
    })),
    availableGenders: Array.from(
      new Set(
        product.images
          .map((img) => img.modelGender)
          .filter((g): g is "MEN" | "WOMEN" => g === "MEN" || g === "WOMEN"),
      ),
    ),
    variants: product.variants
      .map((v) => {
        const colorId = v.optionValues.find((ov) =>
          colors.some((c) => c.id === ov.id),
        )?.id;
        const sizeId = v.optionValues.find((ov) =>
          sizes.some((s) => s.id === ov.id),
        )?.id;
        if (!colorId || !sizeId) return null;
        return {
          id: v.id,
          colorId,
          sizeId,
          quantity: v.inventory?.quantity ?? 0,
        };
      })
      .filter((v) => v !== null),
  };

  const rawColor = typeof sp.color === "string" ? sp.color : undefined;
  const rawSize = typeof sp.size === "string" ? sp.size : undefined;
  const rawGender = typeof sp.gender === "string" ? sp.gender.toUpperCase() : undefined;
  const initialGenderParam =
    rawGender === "MEN" || rawGender === "WOMEN" ? rawGender : undefined;

  return (
    <ProductPageClient
      product={detail}
      initialGenderParam={initialGenderParam}
      preferredGender={
        product.gender === "MEN" || product.gender === "WOMEN"
          ? product.gender
          : undefined
      }
      initialColorParam={rawColor}
      initialSizeParam={rawSize}
      initiallyWishlisted={wishlistedIds.has(product.id)}
    />
  );
}
