import { Link } from "@/i18n/navigation";

/**
 * Placeholder monogram — swap for the real O/S ivory monogram asset
 * once it's supplied (see PROJECT_NOTES.md).
 */
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="13"
        cy="16"
        r="10.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M23.5 7.5c-3.5 0-6 1.9-6 4.4 0 5.6 10 3.4 10 8.8 0 2.6-2.6 4.4-6.2 4.4-2.6 0-4.9-.9-6.3-2.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className = "",
  markClassName = "h-6 w-6",
  wordmarkClassName = "text-[15px]",
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 text-warm-white ${className}`}
    >
      <LogoMark className={markClassName} />
      <span
        className={`font-display italic tracking-wide ${wordmarkClassName}`}
      >
        OtherSide
      </span>
    </Link>
  );
}
