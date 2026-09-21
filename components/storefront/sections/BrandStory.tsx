import { getTranslations } from "next-intl/server";
import { CtaLink } from "../Cta";

export async function BrandStory() {
  const t = await getTranslations("brandStory");

  const PRINCIPLES = [
    { title: t("principle1Title"), body: t("principle1Body") },
    { title: t("principle2Title"), body: t("principle2Body") },
    { title: t("principle3Title"), body: t("principle3Body") },
  ];

  return (
    <section className="bg-os-ink text-os-cream">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-copper-light">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 text-4xl leading-[1.08] tracking-tight md:text-5xl">
              {t("headingLine1")}
              <br />
              {t("headingLine2")}
            </h2>
          </div>

          <div className="flex flex-col justify-between gap-12">
            <div className="max-w-md">
              <p className="text-base leading-relaxed text-os-cream/65">
                {t("body")}
              </p>
              <div className="mt-6">
                <CtaLink href="/story" kind="text">
                  {t("readMore")}
                </CtaLink>
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {PRINCIPLES.map((p) => (
                <div key={p.title}>
                  <dt className="text-[11px] uppercase tracking-[0.18em]">
                    {p.title}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-os-cream/50">
                    {p.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
