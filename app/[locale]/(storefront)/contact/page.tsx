import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/site-settings";

export default async function ContactPage() {
  const [t, settings] = await Promise.all([
    getTranslations("contact"),
    getSiteSettings(),
  ]);

  const CHANNELS = [
    { href: settings.whatsappUrl, label: t("whatsapp"), value: settings.whatsappDisplay },
    { href: `mailto:${settings.contactEmail}`, label: t("email"), value: settings.contactEmail },
    { href: settings.instagramUrl, label: t("instagram"), value: "@otherside.store.eg" },
    { href: settings.tiktokUrl, label: t("tiktok"), value: "@otherside.store.eg" },
    { href: settings.facebookUrl, label: t("facebook"), value: "OtherSide" },
  ];

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        {t("eyebrow")}
      </p>
      <h1 className="mt-5 font-display text-4xl italic text-warm-white md:text-5xl">
        {t("heading")}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-warm-white/55">
        {t("intro")}
      </p>

      <div className="mt-10 divide-y divide-warm-white/10 border-y border-warm-white/10">
        {CHANNELS.map((channel) => (
          <Link
            key={channel.label}
            href={channel.href}
            target={channel.href.startsWith("http") ? "_blank" : undefined}
            rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center justify-between py-5 text-sm text-warm-white/70 transition-colors hover:text-warm-white"
          >
            <span className="uppercase tracking-[0.1em]">{channel.label}</span>
            <span dir="ltr">{channel.value}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
