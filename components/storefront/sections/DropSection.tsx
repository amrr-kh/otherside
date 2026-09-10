import { getTranslations } from "next-intl/server";
import { ProductCard } from "../ProductCard";
import { Unavailable } from "../Unavailable";
import { getDropProducts, type StorefrontProduct } from "@/lib/storefront/products";

export async function DropSection() {
  const t = await getTranslations("drop");
  let products: StorefrontProduct[] = [];
  let unavailable = false;
  try {
    products = await getDropProducts();
  } catch (error) {
    console.error("DropSection: failed to load products", error);
    unavailable = true;
  }

  return (
    <section id="drop" className="relative overflow-hidden py-24 md:py-32">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none font-display text-[26vw] italic text-electric-violet/10 md:text-[20vw]"
      >
        {t("giantWord")}
      </span>

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 font-display text-4xl italic text-warm-white md:text-5xl">
            {t("heading")}
          </h2>
        </div>

        {unavailable ? (
          <div className="mt-14">
            <Unavailable />
          </div>
        ) : products.length === 0 ? (
          <p className="mt-14 text-sm text-warm-white/45">{t("empty")}</p>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
