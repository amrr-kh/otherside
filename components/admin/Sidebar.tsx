import Link from "next/link";
import { NAV_SECTIONS } from "./nav-sections";

export function Sidebar() {
  return (
    <nav className="hidden h-full w-56 shrink-0 flex-col gap-1 border-r border-soft-black/10 bg-warm-white px-4 py-6 md:flex">
      {NAV_SECTIONS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded px-3 py-2 text-sm text-soft-black/70 transition-colors hover:bg-soft-black/5 hover:text-soft-black"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
