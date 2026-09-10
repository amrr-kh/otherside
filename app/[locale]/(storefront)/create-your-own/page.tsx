import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SOCIAL_LINKS } from "@/lib/social";

export default async function CreateYourOwnPage() {
  const t = await getTranslations("createYourOwn");

  const CHANNELS = [
    { href: SOCIAL_LINKS.instagram, label: t("instagram") },
    { href: SOCIAL_LINKS.whatsapp, label: t("whatsapp") },
    { href: SOCIAL_LINKS.facebook, label: t("facebook") },
    { href: SOCIAL_LINKS.tiktok, label: t("tiktok") },
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
