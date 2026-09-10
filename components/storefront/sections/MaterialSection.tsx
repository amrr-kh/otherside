import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PlaceholderPhoto } from "../PlaceholderPhoto";

export async function MaterialSection() {
  const t = await getTranslations("material");

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="relative aspect-square md:aspect-auto">
        <PlaceholderPhoto variant="fabric" className="absolute inset-0" />
      </div>
      <div className="flex flex-col justify-center gap-6 bg-dark-purple/40 px-6 py-20 md:px-16 md:py-0">
        <p className="text-xs uppercase tracking-[0.25em] text-magenta">
          {t("eyebrow")}
        </p>
        <h2 className="font-display text-4xl italic leading-[1.05] text-warm-white md:text-5xl">
          {t("heading")}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-warm-white/60">
          {t("body")}
        </p>
        <Link
          href="/create-your-own"
          className="w-fit text-xs uppercase tracking-[0.18em] text-warm-white underline underline-offset-4 hover:text-warm-white/70"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
