import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PlaceholderPhoto } from "../PlaceholderPhoto";

export async function CampaignSection() {
  const t = await getTranslations("campaign");

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center gap-6 bg-soft-black px-6 py-20 md:px-16 md:py-0">
        <h2 className="font-display text-4xl italic leading-[1.05] text-warm-white md:text-5xl">
          {t("line1")}
          <br />
          {t("line2")}
          <br />
          {t("line3")}
        </h2>
        <p className="max-w-xs text-sm text-warm-white/55">{t("tagline")}</p>
        <Link
          href="/create-your-own"
          className="w-fit border border-warm-white/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
        >
          {t("cta")}
        </Link>
      </div>
      <div className="relative aspect-[4/5] md:aspect-auto">
        <PlaceholderPhoto variant="lifestyle" className="absolute inset-0" />
      </div>
    </section>
  );
}
