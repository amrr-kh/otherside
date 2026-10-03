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
}: PageProps<"/[locale]/pants">): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  // Same split as /hoodies: the <title>/description target search intent,
  // the on-page H1 and intro (category.pantsTitle/pantsIntro) are untouched.
  const title = tMeta("pantsTitle");
  const description = trimDescription(tMeta("pantsDescription"));
  const shareTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: pageAlternates(locale, "/pants"),
    openGraph: buildOpenGraph({ locale, path: "/pants", title: shareTitle, description }),
    twitter: buildTwitter({ title: shareTitle, description }),
  };
}

export default async function PantsPage({
  params,
}: PageProps<"/[locale]/pants">) {
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
        name: t("pantsTitle"),
        item: absoluteUrl(localizedPath(locale, "/pants")),
      },
    ],
  };
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <CategoryGrid
        categorySlug="pants"
        title={t("pantsTitle")}
        intro={t("pantsIntro")}
      />
    </>
  );
}
