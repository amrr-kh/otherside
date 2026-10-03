import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_NAME,
  absoluteUrl,
  buildOpenGraph,
  buildTwitter,
  localizedPath,
  pageAlternates,
  trimDescription,
} from "@/lib/seo";
import { CollectionGrid } from "@/components/storefront/CollectionGrid";
import { getCollectionProductsByColor } from "@/lib/storefront/products";
import { COLLECTION_SEO_OVERRIDES } from "@/lib/seo-overrides";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/collections/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  let collection: { name: string; description: string | null } | null = null;
  try {
    collection = await prisma.collection.findUnique({
      where: { slug },
      select: { name: true, description: true },
    });
  } catch (error) {
    console.error(`CollectionPage(${slug}): metadata lookup failed`, error);
  }
  if (!collection) return {};

  const t = await getTranslations({ locale, namespace: "meta" });
  const path = `/collections/${slug}`;
  const baseDescription = trimDescription(
    collection.description || t("categoryFallbackDescription", { name: collection.name }),
  );
  // Search-result-only copy (see lib/seo-overrides.ts); the on-page H1 stays
  // collection.name exactly as the catalog has it.
  const override = COLLECTION_SEO_OVERRIDES[slug]?.[locale === "ar" ? "ar" : "en"];
  const title = override?.title ?? collection.name;
  const description = override?.description ?? baseDescription;
  const shareTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: pageAlternates(locale, path),
    openGraph: buildOpenGraph({ locale, path, title: shareTitle, description }),
    twitter: buildTwitter({ title: shareTitle, description }),
  };
}

export default async function CollectionPage({
  params,
}: PageProps<"/[locale]/collections/[slug]">) {
  const { locale, slug } = await params;

  const collection = await prisma.collection.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!collection) notFound();

  // Real, live products in this collection — one entry per product (not per
  // color), in the order the grid shows them.
  const listedProducts: { slug: string; name: string }[] = [];
  try {
    const cards = await getCollectionProductsByColor(slug);
    const seen = new Set<string>();
    for (const card of cards) {
      if (seen.has(card.slug)) continue;
      seen.add(card.slug);
      listedProducts.push({ slug: card.slug, name: card.name });
    }
  } catch (error) {
    console.error(`CollectionPage(${slug}): failed to load products for schema`, error);
  }

  const collectionJsonLd =
    listedProducts.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: collection.name,
          url: absoluteUrl(localizedPath(locale, `/collections/${slug}`)),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: listedProducts.map((p, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(localizedPath(locale, `/products/${p.slug}`)),
              name: p.name,
            })),
          },
        }
      : null;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: absoluteUrl(localizedPath(locale, "/")),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: collection.name,
        item: absoluteUrl(localizedPath(locale, `/collections/${slug}`)),
      },
    ],
  };

  return (
    <>
      {collectionJsonLd ? <JsonLd data={collectionJsonLd} /> : null}
      <JsonLd data={breadcrumbs} />
      <CollectionGrid
        collectionSlug={slug}
        title={collection.name}
        intro={collection.description}
      />
    </>
  );
}
