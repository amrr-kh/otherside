import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CtaLink } from "../Cta";
import { CAMPAIGN_IMAGES } from "../campaignImages";

/**
 * Image-led opening: two model photos side by side, the message on plain dark
 * next to (desktop) or below (mobile) them. No overlay sits on the photography.
 */
export async function Hero() {
  const t = await getTranslations("hero");
  const headline = [t("line1"), t("line2"), t("line3"), t("line4")].join(" ");

  return (
    <section className="bg-os-ink text-os-cream">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="order-1 grid grid-cols-2 gap-1 md:order-2 md:h-[clamp(560px,calc(100svh-4rem),900px)]">
          {[CAMPAIGN_IMAGES.heroMen, CAMPAIGN_IMAGES.heroWomen].map((src) => (
            <div
              key={src}
              className="relative aspect-[3/4.6] overflow-hidden bg-soft-black md:aspect-auto"
            >
              <Image
                src={src}
                alt=""
                fill
                preload
                sizes="(min-width: 1600px) 480px, (min-width: 768px) 30vw, 50vw"
                className="object-cover object-[50%_12%]"
              />
            </div>
          ))}
        </div>

        <div className="order-2 flex flex-col justify-end px-5 pb-16 pt-12 md:order-1 md:px-10 md:pb-20 md:pt-0">
          <h1 className="max-w-[14ch] text-balance text-[2.6rem] leading-[1.05] tracking-tight md:text-[3.4rem] lg:text-[4.2rem]">
            {headline}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-os-cream/70">
            {t("subtitle")}
          </p>
          <div className="mt-9">
            <CtaLink href="/collections/the-veil-study">{t("cta")}</CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
