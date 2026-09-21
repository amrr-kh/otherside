import { getTranslations } from "next-intl/server";
import { CtaLink } from "../Cta";

/** Warm off-white brand introduction that follows the hero. */
export async function Intro() {
  const t = await getTranslations("intro");

  return (
    <section
      className="bg-os-cream text-os-ink"
      style={{ colorScheme: "light" }}
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-5 py-20 md:grid-cols-2 md:gap-24 md:px-10 md:py-32">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-os-burgundy">
            {t("eyebrow")}
          </p>
          <h2 className="mt-5 max-w-[12ch] text-balance text-4xl leading-[1.08] tracking-tight md:text-5xl">
            {t("heading")}
          </h2>
        </div>
        <div className="flex flex-col justify-end gap-8">
          <p className="max-w-md text-base leading-relaxed text-os-ink/65">
            {t("body")}
          </p>
          <CtaLink
            href="/collections/the-veil-study"
            kind="text"
            tone="onLight"
          >
            {t("cta")}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
