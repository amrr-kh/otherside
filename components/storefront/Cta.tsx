import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** Small arrow that nudges on hover and flips in right-to-left languages. */
export function CtaArrow({ className = "" }: { className?: string }) {
  return (
    <ArrowRight
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 transition-transform duration-300 group-hover/cta:translate-x-1 rtl:rotate-180 rtl:group-hover/cta:-translate-x-1 ${className}`}
    />
  );
}

/**
 * The storefront's call to action. "solid" is a quiet filled button, "text" is
 * a plain label with an arrow. Hover uses opacity and arrow movement only:
 * never an underline.
 */
export function CtaLink({
  href,
  children,
  kind = "solid",
  tone = "onDark",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  kind?: "solid" | "text";
  tone?: "onDark" | "onLight";
  className?: string;
}) {
  const look =
    kind === "solid"
      ? tone === "onDark"
        ? "bg-os-burgundy px-7 py-4 text-os-cream hover:opacity-90"
        : "bg-os-ink px-7 py-4 text-os-cream hover:opacity-85"
      : tone === "onDark"
        ? "py-2 text-os-cream hover:opacity-70"
        : "py-2 text-os-ink hover:opacity-60";

  return (
    <Link
      href={href}
      className={`group/cta inline-flex w-fit items-center gap-3 text-xs uppercase tracking-[0.18em] transition-opacity ${look} ${className}`}
    >
      {children}
      <CtaArrow />
    </Link>
  );
}
