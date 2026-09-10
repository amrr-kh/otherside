import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Unavailable } from "@/components/storefront/Unavailable";
import {
  searchProductsByColor,
  type StorefrontProduct,
} from "@/lib/storefront/products";

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: PageProps<"/[locale]/search">) {
  const sp = await searchParams;
  const query = typeof sp.q === "string" ? sp.q.trim() : "";
  const t = await getTranslations("search");

  let products: StorefrontProduct[] = [];
  let unavailable = false;
  if (query) {
    try {
      products = await searchProductsByColor(query);
    } catch (error) {
      console.error(`SearchPage(${query}): failed to load`, error);
      unavailable = true;
    }
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
      <h1 className="font-display text-4xl italic text-warm-white md:text-5xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-md text-sm text-warm-white/50">
        {query ? t("resultsFor", { query }) : t("intro")}
      </p>

      {unavailable ? (
        <div className="mt-14">
          <Unavailable />
        </div>
      ) : !query ? null : products.length === 0 ? (
        <p className="mt-14 text-sm text-warm-white/45">{t("noResults")}</p>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 md:gap-x-8">
          {products.map((product, i) => (
            <ProductCard
              key={`${product.slug}-${product.colors[0]}-${i}`}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
