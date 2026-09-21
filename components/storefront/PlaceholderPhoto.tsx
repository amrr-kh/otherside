// Neutral warm tones, in keeping with the storefront palette.
const VARIANTS = {
  hero: "from-[#2a1a1a] via-[#181212] to-[#0d0b0b]",
  model: "from-[#321313] via-[#1a1313] to-[#0d0b0b]",
  product: "from-[#2b2523] via-[#1c1817] to-[#111010]",
  fabric: "from-[#3a2820] via-[#221a17] to-[#111010]",
  lifestyle: "from-[#3a2820] via-[#1c1614] to-[#0d0b0b]",
} as const;

type Variant = keyof typeof VARIANTS;

/**
 * Stand-in shown when a product has no photo yet, so the layout still reads
 * correctly instead of showing a broken image box.
 */
export function PlaceholderPhoto({
  variant = "product",
  className = "",
  label,
}: {
  variant?: Variant;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${VARIANTS[variant]} ${className}`}
    >
      {label ? (
        <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.2em] text-warm-white/30">
          {label}
        </span>
      ) : null}
    </div>
  );
}
