import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/site-settings";

export default async function CreateYourOwnPage() {
  const [t, settings] = await Promise.all([
    getTranslations("createYourOwn"),
    getSiteSettings(),
  ]);

  const CHANNELS = [
    { href: settings.instagramUrl, label: t("instagram") },
    { href: settings.whatsappUrl, label: t("whatsapp") },
    { href: settings.facebookUrl, label: t("facebook") },
    { href: settings.tiktokUrl, label: t("tiktok") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        {t("eyebrow")}
      </p>
      <h1 className="mt-5 font-display text-4xl italic leading-[1.05] text-warm-white md:text-5xl">
        {t("heading")}
      </h1>
      <p className="mt-6 text-base leading-relaxed text-warm-white/60">
        {t("body")}
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        {CHANNELS.map((channel) => (
          <Link
            key={channel.label}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-warm-white/70 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
          >
            {channel.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
