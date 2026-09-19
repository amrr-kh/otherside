import "server-only";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  NO_INDEX,
  SITE_NAME,
  buildOpenGraph,
  buildTwitter,
  pageAlternates,
  trimDescription,
} from "@/lib/seo";

/** Metadata for an indexable static page, using the `meta.<key>Title/Description` messages. */
export async function publicPageMetadata(
  locale: string,
  path: string,
  key: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t(`${key}Title`);
  const description = trimDescription(t(`${key}Description`));
  const shareTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: pageAlternates(locale, path),
    openGraph: buildOpenGraph({ locale, path, title: shareTitle, description }),
    twitter: buildTwitter({ title: shareTitle, description }),
  };
}

/** Metadata for a page that must never be indexed (cart, checkout, account, ...). */
export async function privatePageMetadata(
  locale: string,
  key: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t(`${key}Title`), robots: NO_INDEX };
}
