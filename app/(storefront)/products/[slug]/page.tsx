import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getWishlistProductIds } from "@/lib/storefront/wishlist";
import { ProductPageClient } from "@/components/storefront/product/ProductPageClient";
import type { ProductDetail } from "@/components/storefront/product/types";

export const revalidate = 60;

export default async function ProductPage({
  params,
  searchParams,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;

  const product = await prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      options: { include: { values: { orderBy: { sortOrder: "asc" } } } },
      variants: { include: { optionValues: true, inventory: true } },
    },
  });

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
      sortOrder: img.sortOrder,
    })),
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

  const wishlistedIds = await getWishlistProductIds();

  const rawColor = typeof sp.color === "string" ? sp.color : undefined;
  const rawSize = typeof sp.size === "string" ? sp.size : undefined;

  return (
    <ProductPageClient
      product={detail}
      initialColorParam={rawColor}
      initialSizeParam={rawSize}
      initiallyWishlisted={wishlistedIds.has(product.id)}
    />
  );
}
