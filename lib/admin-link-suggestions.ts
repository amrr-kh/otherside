import "server-only";
import { prisma } from "@/lib/db";

/** Real pages an admin can point a button at (only ones that exist on the site). */
export async function getLinkSuggestions() {
  const [collections, products] = await Promise.all([
    prisma.collection.findMany({
      select: { slug: true, name: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return [
    { value: "/hoodies", label: "All hoodies" },
    { value: "/pants", label: "All pants" },
    { value: "/create-your-own", label: "Create your own" },
    ...collections.map((c) => ({
      value: `/collections/${c.slug}`,
      label: `Collection: ${c.name}`,
    })),
    ...products.map((p) => ({
      value: `/products/${p.slug}`,
      label: `Product: ${p.name}`,
    })),
  ];
}
