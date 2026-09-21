import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/seo-pages";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/site-settings";

export default async function ReturnsPage() {
  const [t, settings] = await Promise.all([
    getTranslations("returns"),
    getSiteSettings(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        {t("eyebrow")}
      </p>
      <h1 className="mt-5 text-3xl tracking-tight text-warm-white md:text-4xl">
        {t("heading")}
      </h1>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-warm-white/60">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p>
          {t("p3Prefix")}{" "}
          <Link
            href="/create-your-own"
            className="text-copper-light transition-opacity hover:opacity-70"
          >
            {t("p3Link")}
          </Link>{" "}
          {t("p3Suffix")}
        </p>
        <p>
          {t.rich("p4", {
            whatsapp: (chunks) => (
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-copper-light transition-opacity hover:opacity-70"
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

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/returns">): Promise<Metadata> {
  const { locale } = await params;
  return publicPageMetadata(locale, "/returns", "returns");
}
