import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
          {t("eyebrow")}
        </p>
        <h1 className="mt-5 font-display text-4xl italic text-warm-white md:text-6xl">
          {t("heading")}
        </h1>
        <p className="mt-5 max-w-sm text-sm text-warm-white/55">
          {t("body")}
        </p>
        <Link
          href="/"
          className="mt-9 border border-warm-white/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
        >
          {t("cta")}
        </Link>
      </main>
      <Footer />
    </>
  );
}
