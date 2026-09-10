import Link from "next/link";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { href: "/hoodies", label: "Hoodies" },
      { href: "/pants", label: "Pants" },
      { href: "/create-your-own", label: "Create Your Own" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/track-order", label: "Track Order" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/story", label: "Our Story" },
      { href: "/brand", label: "The Brand" },
    ],
  },
  {
    heading: "Social",
    links: [
      { href: "https://instagram.com", label: "Instagram" },
      { href: "https://tiktok.com", label: "TikTok" },
      { href: "https://facebook.com", label: "Facebook" },
      { href: "https://wa.me", label: "WhatsApp" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-cosmic-black">
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo wordmarkClassName="text-lg" />
            <p className="mt-5 text-sm leading-relaxed text-warm-white/50">
              See the reality behind the veil.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-warm-white/35">
              A study in silhouette, shadow, and the reality behind the veil.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-warm-white">
                {col.heading}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-warm-white/55 transition-colors hover:text-warm-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-warm-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} OtherSide. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <button type="button" className="text-warm-white/70 hover:text-warm-white">
              EN
            </button>
            <span className="text-warm-white/20">/</span>
            <button type="button" className="hover:text-warm-white/70">
              العربية
            </button>
            <span className="mx-2 text-warm-white/20">|</span>
            <Link href="/privacy" className="hover:text-warm-white/70">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-warm-white/70">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
