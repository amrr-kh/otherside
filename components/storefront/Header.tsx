"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Logo } from "./Logo";

const ICON = "h-[18px] w-[18px]";
const ICON_BUTTON =
  "flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-60";

export function Header({ cartCount = 0 }: { cartCount?: number }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const NAV_LINKS = [
    { href: "/hoodies", label: t("hoodies") },
    { href: "/pants", label: t("pants") },
    { href: "/collections/the-veil-study", label: t("theVeilStudy") },
    { href: "/create-your-own", label: t("createYourOwn") },
  ];

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const query = searchValue.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  }

  return (
    // Solid, no blur: a backdrop-filter would make this header the containing
    // block of the full-screen mobile menu (position: fixed) and shrink it.
    <header className="sticky top-0 z-50 bg-os-ink text-os-cream">
      <div className="mx-auto grid h-14 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-3 md:h-16 md:px-10">
        {/* Left: menu + search on mobile, the logo on desktop. */}
        <div className="flex items-center justify-self-start">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={`${ICON_BUTTON} md:hidden`}
            aria-label={t("openMenu")}
          >
            <Menu className={ICON} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={t("search")}
            className={`${ICON_BUTTON} md:hidden`}
          >
            <Search className={ICON} strokeWidth={1.5} />
          </button>
          <Logo className="hidden md:flex" wordmarkClassName="text-lg" />
        </div>

        {/* Centre: the logo on mobile, the main navigation on desktop. */}
        <div className="justify-self-center">
          <Logo className="md:hidden" />
          <nav className="hidden items-center gap-9 text-[11px] uppercase tracking-[0.18em] md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="opacity-75 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: utilities. */}
        <div className="flex items-center justify-self-end">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={t("search")}
            className={`${ICON_BUTTON} hidden md:flex`}
          >
            <Search className={ICON} strokeWidth={1.5} />
          </button>
          <Link href="/account" aria-label={t("account")} className={ICON_BUTTON}>
            <User className={ICON} strokeWidth={1.5} />
          </Link>
          <Link
            href="/wishlist"
            aria-label={t("wishlist")}
            className={`${ICON_BUTTON} hidden md:flex`}
          >
            <Heart className={ICON} strokeWidth={1.5} />
          </Link>
          <Link
            href="/cart"
            aria-label={t("bag")}
            className={`${ICON_BUTTON} relative`}
          >
            <ShoppingBag className={ICON} strokeWidth={1.5} />
            {cartCount > 0 ? (
              <span className="absolute end-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-os-copper text-[9px] text-os-cream">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {searchOpen ? (
        <div className="bg-os-black">
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 py-4 md:px-10"
          >
            <Search className="h-4 w-4 shrink-0 opacity-40" strokeWidth={1.5} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent text-sm text-os-cream placeholder:text-os-cream/35 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label={t("closeMenu")}
              className="shrink-0 opacity-50 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="menu-fade fixed inset-0 z-50 flex flex-col bg-os-ink md:hidden">
          <div className="flex h-14 items-center justify-between px-5">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={t("closeMenu")}
              className={ICON_BUTTON}
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-7 px-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-4 text-xs uppercase tracking-[0.18em] opacity-60">
              <Link href="/account" onClick={() => setMenuOpen(false)}>
                {t("account")}
              </Link>
              <Link href="/wishlist" onClick={() => setMenuOpen(false)}>
                {t("wishlist")}
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
