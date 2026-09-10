import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function BrandStory() {
  const t = await getTranslations("brandStory");

  const PRINCIPLES = [
    { title: t("principle1Title"), body: t("principle1Body") },
    { title: t("principle2Title"), body: t("principle2Body") },
    { title: t("principle3Title"), body: t("principle3Body") },
  ];

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
            {t("eyebrow")}
          </p>
          <h2 className="mt-5 font-display text-4xl italic leading-[1.05] text-warm-white md:text-5xl">
            {t("headingLine1")}
            <br />
            {t("headingLine2")}
          </h2>
        </div>

        <div className="flex flex-col justify-between gap-10">
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-warm-white/60">
              {t("body")}
            </p>
            <Link
              href="/story"
              className="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-warm-white/70 underline underline-offset-4 hover:text-warm-white"
            >
              {t("readMore")}
            </Link>
          </div>

          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title}>
                <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-white">
                  {p.title}
                </dt>
                <dd className="mt-2 text-sm text-warm-white/50">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
