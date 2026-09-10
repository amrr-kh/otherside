import { ProductCard } from "../ProductCard";
import { getTrendingProducts } from "@/lib/storefront/products";

export async function SelectedProducts() {
  let products;
  try {
    products = await getTrendingProducts();
  } catch (error) {
    console.error("SelectedProducts: failed to load products", error);
    return null;
  }
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
            Trending Now
          </p>
          <h2 className="mt-4 font-display text-4xl italic text-warm-white md:text-5xl">
            Pulled from the dark.
          </h2>
        </div>
        <p className="max-w-xs text-sm text-warm-white/45">
          A short list. It doesn&apos;t need to be spelled out.
        </p>
      </div>

      <div className="mt-14 grid max-w-2xl grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
