"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { href: "/hoodies", label: "Hoodies" },
  { href: "/pants", label: "Pants" },
  { href: "/create-your-own", label: "Create Your Own" },
];

export function Header({ cartCount = 0 }: { cartCount?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-cosmic-black/95 backdrop-blur border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex items-center justify-center md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Logo className="md:hidden" />
        <Logo className="hidden md:flex" wordmarkClassName="text-lg" />

        <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.18em] text-warm-white/80 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-warm-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          <button
            type="button"
            aria-label="Search"
            className="hidden transition-colors hover:text-electric-violet md:block"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden transition-colors hover:text-electric-violet md:block"
          >
            <User className="h-[18px] w-[18px]" />
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="transition-colors hover:text-electric-violet"
          >
            <Heart className="h-[18px] w-[18px]" />
          </Link>
          <Link
            href="/cart"
            aria-label="Bag"
            className="relative transition-colors hover:text-electric-violet"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-electric-violet text-[9px] font-medium text-warm-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-cosmic-black md:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-6 px-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl italic text-warm-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
