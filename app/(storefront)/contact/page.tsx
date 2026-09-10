import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/social";

const CHANNELS = [
  { href: SOCIAL_LINKS.whatsapp, label: "WhatsApp", value: SOCIAL_LINKS.whatsappDisplay },
  { href: `mailto:${SOCIAL_LINKS.email}`, label: "Email", value: SOCIAL_LINKS.email },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", value: "@otherside.store.eg" },
  { href: SOCIAL_LINKS.tiktok, label: "TikTok", value: "@otherside.store.eg" },
  { href: SOCIAL_LINKS.facebook, label: "Facebook", value: "OtherSide" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        Get in Touch
      </p>
      <h1 className="mt-5 font-display text-4xl italic text-warm-white md:text-5xl">
        Contact
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-warm-white/55">
        Order questions, sizing help, custom requests, or anything else —
        WhatsApp is the fastest way to reach us.
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
            <span>{channel.value}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
