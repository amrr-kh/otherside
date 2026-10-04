import { Link } from "@/i18n/navigation";

/** The real OtherSide monogram and wordmark (ivory artwork, transparent background). */
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo-mark.png"
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
    />
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
      <span className={`flex items-center ${wordmarkClassName}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-wordmark.png"
          alt="OtherSide"
          className="h-[1.15em] w-auto"
        />
      </span>
    </Link>
  );
}
