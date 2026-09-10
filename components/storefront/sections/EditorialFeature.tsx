import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PlaceholderPhoto } from "../PlaceholderPhoto";

export async function EditorialFeature() {
  const t = await getTranslations("editorial");

  const FEATURES = [
    {
      eyebrow: t("hoodiesEyebrow"),
      title: t("hoodiesTitle"),
      body: t("hoodiesBody"),
      href: "/hoodies",
      variant: "model" as const,
    },
    {
      eyebrow: t("pantsEyebrow"),
      title: t("pantsTitle"),
      body: t("pantsBody"),
      href: "/pants",
      variant: "product" as const,
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {FEATURES.map((f) => (
        <Link key={f.title} href={f.href} className="group relative block">
          <div className="relative aspect-[4/5] overflow-hidden">
            <PlaceholderPhoto
              variant={f.variant}
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-warm-white/50">
              {f.eyebrow}
            </p>
            <h3 className="mt-3 max-w-xs font-display text-2xl italic text-warm-white md:text-3xl">
              {f.title}
            </h3>
            <p className="mt-2 max-w-xs text-sm text-warm-white/55">
              {f.body}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
