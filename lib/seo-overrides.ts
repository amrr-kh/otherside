/**
 * Search-result-only copy for the two products and the one collection that
 * exist today, keyed by slug and locale.
 *
 * This never touches the database or the on-page name/description a visitor
 * reads (Product.name, Product.shortDescription, Collection.description,
 * every H1) — those stay exactly as the catalog has them. It only overrides
 * what a search engine shows in the `<title>` tag and, for Arabic, the
 * `<meta name="description">`: the catalog has no Arabic name/description
 * fields, so without this an Arabic results snippet was showing English
 * text. The English product descriptions were added on 4 Oct 2026 because
 * the catalog's one-line shortDescription was too short to work as a snippet.
 */
type SeoOverride = { title?: string; description?: string };
type LocaleOverrides = { en?: SeoOverride; ar?: SeoOverride };

export const PRODUCT_SEO_OVERRIDES: Record<string, LocaleOverrides> = {
  "basic-hoodie": {
    en: {
      title: "Oversized Unisex Hoodie — Basic Hoodie Egypt",
      description:
        "OtherSide Basic Hoodie — an oversized unisex hoodie in a relaxed fit, every colour, sizes S to XL. Cash on delivery in Cairo and Giza, InstaPay and mobile wallets.",
    },
    ar: {
      title: "هودي اوفر سايز للجنسين — Basic Hoodie",
      description:
        "هودي OtherSide الأساسي — سيلويت واسع ومريح للجنسين، بعدة ألوان ومقاسات من S إلى XL. الدفع عند الاستلام في القاهرة والجيزة.",
    },
  },
  "wide-leg-pants": {
    en: {
      title: "Wide-Leg Unisex Pants — Wide-Leg Pants Egypt",
      description:
        "OtherSide Wide-Leg Pants — fluid unisex wide-leg pants with a relaxed drop, every colour, sizes S to XL. Cash on delivery in Cairo and Giza, InstaPay and mobile wallets.",
    },
    ar: {
      title: "بنطلون واسع الساق للجنسين — Wide-Leg Pants",
      description:
        "بنطلون OtherSide الواسع — سيلويت انسيابي للجنسين، بعدة ألوان ومقاسات من S إلى XL. الدفع عند الاستلام في القاهرة والجيزة.",
    },
  },
};

export const COLLECTION_SEO_OVERRIDES: Record<string, LocaleOverrides> = {
  "the-veil-study": {
    en: {
      title: "The Veil Study — New Collection",
      description:
        "The Veil Study is OtherSide's current drop: oversized hoodies and wide-leg pants in a study of silhouette and shadow.",
    },
    ar: {
      title: "دراسة الستار — مجموعة جديدة",
      description:
        "دراسة الستار هي الإصدار الحالي من OtherSide: هوديز اوفر سايز وبناطيل واسعة الساق، في دراسة للسيلويت والظل.",
    },
  },
};

export function applySeoOverride<T extends { title: string; description: string }>(
  base: T,
  override: SeoOverride | undefined,
): T {
  if (!override) return base;
  return {
    ...base,
    title: override.title ?? base.title,
    description: override.description ?? base.description,
  };
}
