import { getTranslations } from "next-intl/server";
import { ProductCard } from "../ProductCard";
import { Unavailable } from "../Unavailable";
import { getDropProducts, type StorefrontProduct } from "@/lib/storefront/products";

/**
 * The data source returns one card per color. For the home page's featured
 * block we show one card per product, listing all of its colors, so a small
 * catalog reads as "these are our pieces". Prices come straight from the
 * source (sale and offer pricing already applied).
 */
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

export async function DropSection() {
  const t = await getTranslations("drop");
  let products: StorefrontProduct[] = [];
  let unavailable = false;
  try {
    products = onePerProduct(await getDropProducts());
  } catch (error) {
    console.error("DropSection: failed to load products", error);
    unavailable = true;
  }

  return (
    <section id="drop" className="bg-os-ink text-os-cream">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
        <p className="text-[11px] uppercase tracking-[0.28em] text-copper-light">
          {t("eyebrow")}
        </p>
        <h2 className="mt-5 text-4xl leading-[1.08] tracking-tight md:text-5xl">
          {t("heading")}
        </h2>

        {unavailable ? (
          <div className="mt-14">
            <Unavailable />
          </div>
        ) : products.length === 0 ? (
          <p className="mt-14 text-sm text-os-cream/45">{t("empty")}</p>
        ) : (
          <div
            className={`mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-16 md:gap-x-8 ${
              products.length <= 2
                ? "md:gap-x-8"
                : "md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
