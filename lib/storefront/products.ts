import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import {
  getLivePercentPromotions,
  pricedForDisplay,
  type PercentPromotion,
} from "@/lib/promotion-pricing";

export type StorefrontProduct = {
  slug: string;
  name: string;
  price: number;
  /** Original price, set only when it is genuinely higher than `price`. */
  compareAtPrice: number | null;
  colors: string[];
  /** Swatch color of each entry in `colors` (same order); null when none is set. */
  colorHexes?: (string | null)[];
  primaryImageUrl: string | null;
  secondaryImageUrl: string | null;
  /** Set only for single-color cards, so the link can pre-select this color. */
  colorSlug?: string;
};

export const productMediaInclude = {
  // Needed so a limited-offer percentage can be scoped to collections.
  collections: { select: { id: true } },
  images: { orderBy: { sortOrder: "asc" as const } },
  options: {
    include: { values: { orderBy: { sortOrder: "asc" as const } } },
  },
};

type ProductWithMedia = {
  id: string;
  collections?: { id: string }[];
  slug: string;
  name: string;
  basePrice: unknown;
  compareAtPrice?: unknown;
  status?: string;
  images: { url: string; colorOptionValueId: string; sortOrder: number; role: string }[];
  options: { name: string; values: { id: string; value: string; swatchHex: string | null }[] }[];
};

export function toStorefrontProduct(
  product: ProductWithMedia,
  promotions: PercentPromotion[] = [],
): StorefrontProduct {
  const colorOption = product.options.find((o) => o.name === "Color");
  const colors = colorOption?.values.map((v) => v.value) ?? [];
  const firstColorId = colorOption?.values[0]?.id;

  const firstColorImages = firstColorId
    ? product.images.filter((img) => img.colorOptionValueId === firstColorId)
    : product.images;

  const { price, compareAtPrice } = pricedForDisplay(promotions, product);

  return {
    slug: product.slug,
    name: product.name,
    price,
    compareAtPrice,
    colors,
    colorHexes: colorOption?.values.map((v) => v.swatchHex) ?? [],
    primaryImageUrl: firstColorImages[0]?.url ?? null,
    secondaryImageUrl:
      firstColorImages[1]?.url ?? firstColorImages[0]?.url ?? null,
  };
}

/** One card per color, so a customer sees every option instead of one card per product. */
export function toStorefrontProductsByColor(
  product: ProductWithMedia,
  promotions: PercentPromotion[] = [],
): StorefrontProduct[] {
  const colorOption = product.options.find((o) => o.name === "Color");
  const colors = colorOption?.values ?? [];
  if (colors.length === 0) return [toStorefrontProduct(product, promotions)];
  const { price, compareAtPrice } = pricedForDisplay(promotions, product);

  return colors.map((color) => {
    const images = product.images.filter(
      (img) => img.colorOptionValueId === color.id,
    );
    return {
      slug: product.slug,
      name: product.name,
      price,
      compareAtPrice,
      colors: [color.value],
      colorHexes: [color.swatchHex],
      primaryImageUrl: images[0]?.url ?? null,
      secondaryImageUrl: images[1]?.url ?? images[0]?.url ?? null,
      colorSlug: slugify(color.value),
    };
  });
}

/**
 * Runs a product query alongside the live limited-offer lookup (one cached read
 * per request) and maps the rows to cards with any percent-off already applied.
 */
async function toCardsWithLiveOffers(
  query: Promise<ProductWithMedia[]>,
): Promise<StorefrontProduct[]> {
  const [products, promotions] = await Promise.all([
    query,
    getLivePercentPromotions(),
  ]);
  return products.flatMap((p) => toStorefrontProductsByColor(p, promotions));
}

export async function getDropProducts(
  limit = 8,
): Promise<StorefrontProduct[]> {
  // One card per color (not per product) so a small catalog still fills
  // the section out, matching how every category/search page already works.
  return toCardsWithLiveOffers(
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: productMediaInclude,
    }),
  );
}

export async function getTrendingProducts(
  limit = 4,
): Promise<StorefrontProduct[]> {
  return toCardsWithLiveOffers(
    prisma.product.findMany({
      where: { status: "ACTIVE", trending: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
      include: productMediaInclude,
    }),
  );
}

export async function getCategoryProductsByColor(
  categorySlug: string,
): Promise<StorefrontProduct[]> {
  return toCardsWithLiveOffers(
    prisma.product.findMany({
      where: { status: "ACTIVE", category: { slug: categorySlug } },
      orderBy: { createdAt: "desc" },
      include: productMediaInclude,
    }),
  );
}

export async function searchProductsByColor(
  query: string,
): Promise<StorefrontProduct[]> {
  return toCardsWithLiveOffers(
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { shortDescription: { contains: query, mode: "insensitive" } },
          { material: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: productMediaInclude,
    }),
  );
}

export async function getCollectionProductsByColor(
  collectionSlug: string,
): Promise<StorefrontProduct[]> {
  return toCardsWithLiveOffers(
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        collections: { some: { slug: collectionSlug } },
      },
      orderBy: { createdAt: "desc" },
      include: productMediaInclude,
    }),
  );
}
