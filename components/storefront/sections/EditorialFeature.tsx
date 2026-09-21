import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CtaArrow } from "../Cta";
import { CAMPAIGN_IMAGES } from "../campaignImages";

/** Two large photographs, one per category, on a warm light background. */
export async function EditorialFeature() {
  const t = await getTranslations("editorial");

  const FEATURES = [
    {
      eyebrow: t("hoodiesEyebrow"),
      title: t("hoodiesTitle"),
      body: t("hoodiesBody"),
      href: "/hoodies",
      image: CAMPAIGN_IMAGES.editorialHoodies,
    },
    {
      eyebrow: t("pantsEyebrow"),
      title: t("pantsTitle"),
      body: t("pantsBody"),
      href: "/pants",
      image: CAMPAIGN_IMAGES.editorialPants,
    },
  ];

  return (
    <section
      className="bg-os-stone text-os-ink"
      style={{ colorScheme: "light" }}
    >
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-8">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} className="group/cta block">
              <div className="relative aspect-[4/5] overflow-hidden bg-os-cream">
                <Image
                  src={f.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 46vw, 100vw"
                  className="object-cover object-[50%_20%] transition-transform duration-700 ease-out group-hover/cta:scale-[1.03]"
                />
              </div>
              <div className="mt-6 flex items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-os-burgundy">
                    {f.eyebrow}
                  </p>
                  <h3 className="mt-3 max-w-xs text-2xl leading-tight tracking-tight md:text-3xl">
                    {f.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-os-ink/60">
                    {f.body}
                  </p>
                </div>
                <CtaArrow className="mb-1 h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
