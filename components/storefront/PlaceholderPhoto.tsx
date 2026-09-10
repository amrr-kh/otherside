const VARIANTS = {
  hero: "from-[#3c1f49] via-[#201a26] to-[#0d0b12]",
  model: "from-[#4a2358] via-[#271e30] to-[#141217]",
  product: "from-[#332a3d] via-[#221c29] to-[#141217]",
  fabric: "from-[#4e2359] via-[#2c1938] to-[#141217]",
  lifestyle: "from-[#5c2a52] via-[#2a1d2c] to-[#0d0b12]",
} as const;

type Variant = keyof typeof VARIANTS;

/**
 * Stand-in for real campaign photography — will be replaced by uploaded
 * product/editorial images once real assets exist. Deliberately styled
 * so the layout reads correctly rather than showing broken image boxes.
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
      <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {label ? (
        <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.2em] text-warm-white/30">
          {label}
        </span>
      ) : null}
    </div>
  );
}
