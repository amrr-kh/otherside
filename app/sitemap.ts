import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { routing } from "@/i18n/routing";
import { absoluteUrl, localizedPath } from "@/lib/seo";

// Regenerated at most hourly, and immediately whenever an admin changes a
// product (see revalidateStorefront in the admin product actions).
export const revalidate = 3600;

type Entry = { path: string; lastModified?: Date };

const STATIC_PATHS = [
  "/story",
  "/contact",
  "/shipping",
  "/returns",
  "/privacy",
  "/terms",
  "/create-your-own",
];

function toEntries(entry: Entry): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        absoluteUrl(localizedPath(locale, entry.path)),
      ]),
    ),
    "x-default": absoluteUrl(localizedPath(routing.defaultLocale, entry.path)),
  };

  return routing.locales.map((locale) => ({
    url: absoluteUrl(localizedPath(locale, entry.path)),
    ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: Entry[] = STATIC_PATHS.map((path) => ({ path }));

  try {
    const [products, collections] = await Promise.all([
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.collection.findMany({
        where: { products: { some: { status: "ACTIVE" } } },
        select: { slug: true },
      }),
    ]);

    const newestProductUpdate = products[0]?.updatedAt;
    entries.unshift(
      { path: "/", lastModified: newestProductUpdate },
      { path: "/hoodies", lastModified: newestProductUpdate },
      { path: "/pants", lastModified: newestProductUpdate },
    );
    for (const collection of collections) {
      entries.push({ path: `/collections/${collection.slug}` });
    }
    for (const product of products) {
      entries.push({
        path: `/products/${product.slug}`,
        lastModified: product.updatedAt,
      });
    }
  } catch (error) {
    // A transient database error must not turn the sitemap into a 500 for
    // crawlers; serve the static pages and pick the catalog up next refresh.
    console.error("sitemap: failed to load catalog, serving static pages only", error);
    entries.unshift(
      { path: "/" },
      { path: "/hoodies" },
      { path: "/pants" },
    );
  }

  return entries.flatMap(toEntries);
}
