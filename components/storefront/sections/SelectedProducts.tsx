import { getTranslations } from "next-intl/server";
import { ProductCard } from "../ProductCard";
import {
  getDropProducts,
  getTrendingProducts,
  type StorefrontProduct,
} from "@/lib/storefront/products";

/** One card per product (the source returns one per color). */
function onePerProduct(cards: StorefrontProduct[]): StorefrontProduct[] {
  const bySlug = new Map<string, StorefrontProduct>();
  for (const card of cards) {
    const existing = bySlug.get(card.slug);
    if (!existing) {
      bySlug.set(card.slug, {
        ...card,
        colors: [...card.colors],
        colorHexes: [...(card.colorHexes ?? [])],
        colorSlug: undefined,
      });
    } else {
      existing.colors.push(...card.colors);
      existing.colorHexes?.push(...(card.colorHexes ?? []));
    }
  }
  return [...bySlug.values()];
}

/**
 * "Trending" products flagged in admin. Anything already shown in the featured
 * block right above is left out, so the page never repeats itself; the section
 * only appears when a trending product is not already featured.
 */
export async function SelectedProducts() {
  const t = await getTranslations("selectedProducts");
  let products: StorefrontProduct[];
  try {
    const [trending, featured] = await Promise.all([
      getTrendingProducts(),
      getDropProducts(),
    ]);
    const featuredSlugs = new Set(featured.map((p) => p.slug));
    products = onePerProduct(trending).filter((p) => !featuredSlugs.has(p.slug));
  } catch (error) {
    console.error("SelectedProducts: failed to load products", error);
    return null;
  }
  if (products.length === 0) return null;

  return (
    <section className="bg-os-ink text-os-cream">
      <div className="mx-auto max-w-[1600px] px-5 pb-20 md:px-10 md:pb-32">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-copper-light">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 text-4xl leading-[1.08] tracking-tight md:text-5xl">
              {t("heading")}
            </h2>
          </div>
          <p className="max-w-xs text-sm text-os-cream/50">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-16 md:max-w-4xl md:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
