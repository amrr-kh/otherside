import { getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/lib/site-settings";

export default async function ShippingPage() {
  const [t, settings] = await Promise.all([
    getTranslations("shipping"),
    getSiteSettings(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        {t("eyebrow")}
      </p>
      <h1 className="mt-5 font-display text-4xl italic text-warm-white md:text-5xl">
        {t("heading")}
      </h1>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-warm-white/60">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
        <p>
          {t.rich("p4", {
            whatsapp: (chunks) => (
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-white underline underline-offset-4 hover:text-electric-violet"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
