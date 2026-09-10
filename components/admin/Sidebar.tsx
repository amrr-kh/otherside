import Link from "next/link";

const NAV_SECTIONS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/discounts", label: "Discount Codes" },
  { href: "/admin/shipping", label: "Shipping" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <nav className="flex h-full w-56 shrink-0 flex-col gap-1 border-r border-soft-black/10 bg-warm-white px-4 py-6">
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
