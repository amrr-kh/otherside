"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_SECTIONS } from "./nav-sections";

export function MobileSidebarToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center text-soft-black md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <nav className="flex w-72 max-w-[80vw] flex-col gap-1 overflow-y-auto bg-warm-white px-4 py-6">
            <div className="mb-4 flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-soft-black">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-soft-black" />
              </button>
            </div>
            {NAV_SECTIONS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded px-3 py-2 text-sm text-soft-black/70 transition-colors hover:bg-soft-black/5 hover:text-soft-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label="Close menu"
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      ) : null}
    </>
  );
}
