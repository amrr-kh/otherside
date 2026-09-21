import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CtaLink } from "../Cta";
import { CAMPAIGN_IMAGES } from "../campaignImages";

/** Male and female model side by side, with a short invitation to build a piece. */
export async function CampaignSection() {
  const t = await getTranslations("campaign");

  return (
    <section className="bg-os-burgundy-deep text-os-cream">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 py-20 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:items-end md:gap-16 md:px-10 md:py-32">
        <div className="flex flex-col gap-6 md:pb-4">
          <h2 className="text-4xl leading-[1.08] tracking-tight md:text-5xl">
            {t("line1")} {t("line2")} {t("line3")}
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-os-cream/65">
            {t("tagline")}
          </p>
          <CtaLink href="/create-your-own" kind="text">
            {t("cta")}
          </CtaLink>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-5">
          {[CAMPAIGN_IMAGES.campaignMen, CAMPAIGN_IMAGES.campaignWomen].map(
            (src) => (
              <div
                key={src}
                className="relative aspect-[4/5] overflow-hidden bg-os-black"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 32vw, 50vw"
                  className="object-cover object-[50%_18%]"
                />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
