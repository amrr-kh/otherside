import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { JsonLd } from "@/components/JsonLd";
import { normalizeCompareAtPrice } from "@/lib/pricing";
import {
  SITE_NAME,
  absoluteImageUrl,
  absoluteUrl,
  buildOpenGraph,
  buildTwitter,
  localizedPath,
  pageAlternates,
  trimDescription,
} from "@/lib/seo";
import { getWishlistProductIds } from "@/lib/storefront/wishlist";
import { ProductPageClient } from "@/components/storefront/product/ProductPageClient";
import { ProductReviews } from "@/components/storefront/product/ProductReviews";
import type { ProductDetail } from "@/components/storefront/product/types";

export const revalidate = 60;

// Shared by generateMetadata and the page so one request runs one query.
const getProduct = cache((slug: string) =>
  prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      options: { include: { values: { orderBy: { sortOrder: "asc" } } } },
      variants: { include: { optionValues: true, inventory: true } },
    },
  }),
);

function primaryImageUrl(
  images: { url: string; isPrimary: boolean }[],
): string | null {
  const image = images.find((img) => img.isPrimary) ?? images[0];
  return image ? absoluteImageUrl(image.url) : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/products/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;

  let product: Awaited<ReturnType<typeof getProduct>> = null;
  try {
    product = await getProduct(slug);
  } catch (error) {
    console.error(`ProductPage(${slug}): metadata lookup failed`, error);
  }
  if (!product) return {};

  const path = `/products/${slug}`;
  const description = trimDescription(
    product.shortDescription || product.fullDescription,
  );
  const image = primaryImageUrl(product.images);
  const shareTitle = `${product.name} | ${SITE_NAME}`;

  return {
    title: product.name,
    description,
    alternates: pageAlternates(locale, path),
    openGraph: buildOpenGraph({ locale, path, title: shareTitle, description, image }),
    twitter: buildTwitter({ title: shareTitle, description, image }),
    other: {
      "product:price:amount": String(Number(product.basePrice)),
      "product:price:currency": "EGP",
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: PageProps<"/[locale]/products/[slug]">) {
  const { locale, slug } = await params;
  const sp = await searchParams;

  let product;
  let wishlistedIds: Set<string>;
  try {
    [product, wishlistedIds] = await Promise.all([
      getProduct(slug),
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

  let reviews: { id: string; customerName: string; rating: number; body: string; createdAt: Date }[] = [];
  try {
    reviews = await prisma.review.findMany({
      where: { productId: product.id, isApproved: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, customerName: true, rating: true, body: true, createdAt: true },
    });
  } catch (error) {
    console.error(`ProductPage(${slug}): failed to load reviews`, error);
  }

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

  const price = Number(product.basePrice);
  const originalPrice = normalizeCompareAtPrice(
    price,
    product.compareAtPrice == null ? null : Number(product.compareAtPrice),
  );
  const inStock = product.variants.some(
    (v) => v.isActive && (v.inventory?.quantity ?? 0) > 0,
  );
  const productUrl = absoluteUrl(localizedPath(locale, `/products/${slug}`));
  const imageUrls = product.images.map((img) => absoluteImageUrl(img.url));

  // Only real database values: no ratings/reviews (approved reviews may be
  // demo content), and price/availability mirror what the page itself shows.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: trimDescription(product.fullDescription || product.shortDescription, 5000),
    url: productUrl,
    ...(imageUrls.length > 0 ? { image: imageUrls } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(product.material ? { material: product.material } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: price.toFixed(2),
      priceCurrency: "EGP",
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      ...(originalPrice !== null
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: originalPrice.toFixed(2),
              priceCurrency: "EGP",
              priceType: "https://schema.org/StrikethroughPrice",
            },
          }
        : {}),
    },
  };

  // Category pages exist only for these two categories, so only they are linked.
  const categoryCrumb =
    product.category && ["hoodies", "pants"].includes(product.category.slug)
      ? {
          name: product.category.name,
          item: absoluteUrl(localizedPath(locale, `/${product.category.slug}`)),
        }
      : null;
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: SITE_NAME, item: absoluteUrl(localizedPath(locale, "/")) },
      ...(categoryCrumb ? [categoryCrumb] : []),
      { name: product.name, item: productUrl },
    ].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbs} />
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
      <ProductReviews
        productId={product.id}
        productSlug={product.slug}
        reviews={reviews.map((r) => ({
          id: r.id,
          customerName: r.customerName,
          rating: r.rating,
          body: r.body,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
