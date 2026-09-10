import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SOCIAL_LINKS } from "@/lib/social";

export default async function ReturnsPage() {
  const t = await getTranslations("returns");

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
        <p>
          {t("p3Prefix")}{" "}
          <Link
            href="/create-your-own"
            className="text-warm-white underline underline-offset-4 hover:text-electric-violet"
          >
            {t("p3Link")}
          </Link>{" "}
          {t("p3Suffix")}
        </p>
        <p>
          {t.rich("p4", {
            whatsapp: (chunks) => (
              <a
                href={SOCIAL_LINKS.whatsapp}
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
