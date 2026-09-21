import { getTranslations } from "next-intl/server";
import { CtaLink } from "../Cta";

/** "Complete the look": warm brown accent block that points to Create Your Own. */
export async function MaterialSection() {
  const t = await getTranslations("material");

  return (
    <section className="bg-os-brown text-os-cream">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-5 py-20 md:grid-cols-2 md:gap-24 md:px-10 md:py-28">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-copper-light">
            {t("eyebrow")}
          </p>
          <h2 className="mt-5 text-4xl leading-[1.08] tracking-tight md:text-5xl">
            {t("heading")}
          </h2>
        </div>
        <div className="flex flex-col justify-end gap-8">
          <p className="max-w-sm text-base leading-relaxed text-os-cream/70">
            {t("body")}
          </p>
          <CtaLink href="/create-your-own" kind="text">
            {t("cta")}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
