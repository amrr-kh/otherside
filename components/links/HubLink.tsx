import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type HubLinkProps = {
  href: string;
  /** Stable analytics id, e.g. "hoodies". */
  name: string;
  section: "shop" | "support" | "help" | "social";
  position: number;
  className?: string;
  children: ReactNode;
  /** Set for links that leave the site; opens in a new tab. */
  external?: boolean;
  "aria-label"?: string;
};

export function HubLink({
  href,
  name,
  section,
  position,
  external = false,
  className,
  children,
  "aria-label": ariaLabel,
}: HubLinkProps) {
  const tracking = {
    "data-hub-link": name,
    "data-hub-section": section,
    "data-hub-position": position,
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={className}
        {...tracking}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={className} {...tracking}>
      {children}
    </Link>
  );
}
