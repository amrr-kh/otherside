import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/seo-pages";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getWishlistProducts } from "@/lib/storefront/wishlist";
import { ProductCard } from "@/components/storefront/ProductCard";

export const revalidate = 0;

export default async function WishlistPage() {
  const t = await getTranslations("wishlist");
  const products = await getWishlistProducts();

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
      <h1 className="text-3xl tracking-tight text-warm-white md:text-4xl">
        {t("title")}
      </h1>

      {products.length === 0 ? (
        <div className="mt-10">
          <p className="text-sm text-warm-white/50">{t("empty")}</p>
          <Link
            href="/"
            className="mt-6 inline-block border border-warm-white/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
          >
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 md:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/wishlist">): Promise<Metadata> {
  const { locale } = await params;
  return privatePageMetadata(locale, "wishlist");
}
