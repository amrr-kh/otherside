import { getTranslations } from "next-intl/server";
import { ProductCard } from "./ProductCard";
import { Unavailable } from "./Unavailable";
import { getCategoryProductsByColor, type StorefrontProduct } from "@/lib/storefront/products";

export async function CategoryGrid({
  categorySlug,
  title,
  intro,
}: {
  categorySlug: string;
  title: string;
  intro: string;
}) {
  const t = await getTranslations("category");
  let products: StorefrontProduct[] = [];
  let unavailable = false;
  try {
    products = await getCategoryProductsByColor(categorySlug);
  } catch (error) {
    console.error(`CategoryGrid(${categorySlug}): failed to load products`, error);
    unavailable = true;
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
      <h1 className="font-display text-4xl italic text-warm-white md:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-sm text-warm-white/50">{intro}</p>

      {unavailable ? (
        <div className="mt-14">
          <Unavailable />
        </div>
      ) : products.length === 0 ? (
        <p className="mt-14 text-sm text-warm-white/45">{t("empty")}</p>
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
