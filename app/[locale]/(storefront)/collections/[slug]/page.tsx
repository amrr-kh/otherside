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
  const description = trimDescription(
    collection.description || t("categoryFallbackDescription", { name: collection.name }),
  );
  const shareTitle = `${collection.name} | ${SITE_NAME}`;

  return {
    title: collection.name,
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
      <JsonLd data={breadcrumbs} />
      <CollectionGrid
        collectionSlug={slug}
        title={collection.name}
        intro={collection.description}
      />
    </>
  );
}
