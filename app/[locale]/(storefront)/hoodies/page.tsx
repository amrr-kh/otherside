import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
import { CategoryGrid } from "@/components/storefront/CategoryGrid";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/hoodies">): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  // The <title>/description are keyword-focused copy for search results;
  // the on-page H1 and intro paragraph (category.hoodiesTitle/hoodiesIntro)
  // are untouched and stay exactly as the approved storefront shows them.
  const title = tMeta("hoodiesTitle");
  const description = trimDescription(tMeta("hoodiesDescription"));
  const shareTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: pageAlternates(locale, "/hoodies"),
    openGraph: buildOpenGraph({ locale, path: "/hoodies", title: shareTitle, description }),
    twitter: buildTwitter({ title: shareTitle, description }),
  };
}

export default async function HoodiesPage({
  params,
}: PageProps<"/[locale]/hoodies">) {
  const { locale } = await params;
  const t = await getTranslations("category");
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
        name: t("hoodiesTitle"),
        item: absoluteUrl(localizedPath(locale, "/hoodies")),
      },
    ],
  };
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <CategoryGrid
        categorySlug="hoodies"
        title={t("hoodiesTitle")}
        intro={t("hoodiesIntro")}
      />
    </>
  );
}
