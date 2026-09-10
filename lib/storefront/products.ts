import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export type StorefrontProduct = {
  slug: string;
  name: string;
  price: number;
  colors: string[];
  primaryImageUrl: string | null;
  secondaryImageUrl: string | null;
  /** Set only for single-color cards, so the link can pre-select this color. */
  colorSlug?: string;
};

export const productMediaInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  options: {
    include: { values: { orderBy: { sortOrder: "asc" as const } } },
  },
};

type ProductWithMedia = {
  slug: string;
  name: string;
  basePrice: unknown;
  status?: string;
  images: { url: string; colorOptionValueId: string; sortOrder: number; role: string }[];
  options: { name: string; values: { id: string; value: string; swatchHex: string | null }[] }[];
};

export function toStorefrontProduct(product: ProductWithMedia): StorefrontProduct {
  const colorOption = product.options.find((o) => o.name === "Color");
  const colors = colorOption?.values.map((v) => v.value) ?? [];
  const firstColorId = colorOption?.values[0]?.id;

  const firstColorImages = firstColorId
    ? product.images.filter((img) => img.colorOptionValueId === firstColorId)
    : product.images;

  return {
    slug: product.slug,
    name: product.name,
    price: Number(product.basePrice),
    colors,
    primaryImageUrl: firstColorImages[0]?.url ?? null,
    secondaryImageUrl:
      firstColorImages[1]?.url ?? firstColorImages[0]?.url ?? null,
  };
}

/** One card per color, so a customer sees every option instead of one card per product. */
export function toStorefrontProductsByColor(
  product: ProductWithMedia,
): StorefrontProduct[] {
  const colorOption = product.options.find((o) => o.name === "Color");
  const colors = colorOption?.values ?? [];
  if (colors.length === 0) return [toStorefrontProduct(product)];

  return colors.map((color) => {
    const images = product.images.filter(
      (img) => img.colorOptionValueId === color.id,
    );
    return {
      slug: product.slug,
      name: product.name,
      price: Number(product.basePrice),
      colors: [color.value],
      primaryImageUrl: images[0]?.url ?? null,
      secondaryImageUrl: images[1]?.url ?? images[0]?.url ?? null,
      colorSlug: slugify(color.value),
    };
  });
}

export async function getDropProducts(
  limit = 8,
): Promise<StorefrontProduct[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: productMediaInclude,
  });
  // One card per color (not per product) so a small catalog still fills
  // the section out, matching how every category/search page already works.
  return products.flatMap(toStorefrontProductsByColor);
}

export async function getTrendingProducts(
  limit = 4,
): Promise<StorefrontProduct[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", trending: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: productMediaInclude,
  });
  return products.flatMap(toStorefrontProductsByColor);
}

export async function getCategoryProductsByColor(
  categorySlug: string,
): Promise<StorefrontProduct[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", category: { slug: categorySlug } },
    orderBy: { createdAt: "desc" },
    include: productMediaInclude,
  });
  return products.flatMap(toStorefrontProductsByColor);
}

export async function searchProductsByColor(
  query: string,
): Promise<StorefrontProduct[]> {
  const products = await prisma.product.findMany({
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
  });
  return products.flatMap(toStorefrontProductsByColor);
}

export async function getCollectionProductsByColor(
  collectionSlug: string,
): Promise<StorefrontProduct[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", collections: { some: { slug: collectionSlug } } },
    orderBy: { createdAt: "desc" },
    include: productMediaInclude,
  });
  return products.flatMap(toStorefrontProductsByColor);
}
