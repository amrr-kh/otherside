import Link from "next/link";

const CHANNELS = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://wa.me", label: "WhatsApp" },
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://tiktok.com", label: "TikTok" },
];

export default function CreateYourOwnPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        Custom Orders
      </p>
      <h1 className="mt-5 font-display text-4xl italic leading-[1.05] text-warm-white md:text-5xl">
        Make the silhouette yours.
      </h1>
      <p className="mt-6 text-base leading-relaxed text-warm-white/60">
        Want a custom print, your own design, or a one-off hoodie or pair of
        pants made to spec? We do custom and print-on-demand pieces directly
        — reach out through any of the channels below and our team will walk
        you through it.
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
