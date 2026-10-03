import "server-only";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { absoluteImageUrl, absoluteUrl, SITE_NAME } from "@/lib/seo";
import { getLivePercentPromotions, pricedForDisplay } from "@/lib/promotion-pricing";

// Google only needs a feed this fresh re-fetched every few minutes, not on
// every request; this keeps it off the database otherwise.
export const revalidate = 300;

/**
 * Google Merchant Center product feed (RSS 2.0 + the `g:` namespace).
 *
 * One `<item>` per sellable variant (colour × size), grouped under the
 * product via `g:item_group_id` — the standard shape for apparel with
 * variants. Every value — price, sale price, availability, images — is read
 * live from the same database and the same pricing helper the storefront
 * itself uses, so this can never drift from what a customer actually sees
 * or pays.
 *
 * Public on purpose: Merchant Center fetches this on its own schedule once
 * the URL is registered by hand in the Merchant Center account — it is not
 * linked from the site. Still excluded from crawling/indexing like the rest
 * of /api/* (next.config.ts sets X-Robots-Tag on every /api/* response, and
 * robots.txt disallows /api/).
 */

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

export async function GET() {
  const [products, promotions] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        options: { include: { values: { orderBy: { sortOrder: "asc" } } } },
        variants: { include: { optionValues: true, inventory: true } },
      },
    }),
    getLivePercentPromotions(),
  ]);

  const items: string[] = [];

  for (const product of products) {
    const colorOption = product.options.find((o) => o.name === "Color");
    const sizeOption = product.options.find((o) => o.name === "Size");
    const colors = colorOption?.values ?? [];
    const sizes = sizeOption?.values ?? [];
    if (colors.length === 0 || sizes.length === 0) continue;

    const productUrl = absoluteUrl(`/products/${product.slug}`);

    for (const variant of product.variants) {
      if (!variant.isActive) continue;
      const colorValue = colors.find((c) =>
        variant.optionValues.some((ov) => ov.id === c.id),
      );
      const sizeValue = sizes.find((s) =>
        variant.optionValues.some((ov) => ov.id === s.id),
      );
      if (!colorValue || !sizeValue) continue;

      const colorImages = product.images.filter(
        (img) => img.colorOptionValueId === colorValue.id,
      );
      const primaryImage = colorImages.find((i) => i.isPrimary) ?? colorImages[0];
      if (!primaryImage) continue; // Merchant Center requires an image.

      const inStock = (variant.inventory?.quantity ?? 0) > 0;
      // Reuses the exact same pricing function the product page calls (which
      // itself rounds through the same applyPercentOff() checkout uses), so
      // a variant price override, a live promotion, and the normal case all
      // come out identical to what the storefront shows and what checkout
      // charges. `regularPrice` is the crossed-out price when there is one.
      const variantPriced = pricedForDisplay(promotions, {
        ...product,
        basePrice: variant.priceOverride ?? product.basePrice,
      });
      const regularPrice = variantPriced.compareAtPrice ?? variantPriced.price;
      const onSale = variantPriced.compareAtPrice != null;

      const id = `${product.slug}-${slugify(colorValue.value)}-${slugify(sizeValue.value)}`;
      const link = `${productUrl}?color=${slugify(colorValue.value)}&size=${slugify(sizeValue.value)}`;
      const title = `${product.name} — ${colorValue.value} / ${sizeValue.value}`;

      items.push(`  <item>
    <g:id>${xmlEscape(id)}</g:id>
    <g:item_group_id>${xmlEscape(product.slug)}</g:item_group_id>
    <title>${cdata(title)}</title>
    <description>${cdata(product.shortDescription || product.fullDescription)}</description>
    <link>${xmlEscape(link)}</link>
    <g:image_link>${xmlEscape(absoluteImageUrl(primaryImage.url))}</g:image_link>
    <g:availability>${inStock ? "in_stock" : "out_of_stock"}</g:availability>
    <g:price>${regularPrice.toFixed(2)} EGP</g:price>
    ${onSale ? `<g:sale_price>${variantPriced.price.toFixed(2)} EGP</g:sale_price>` : ""}
    <g:brand>${xmlEscape(SITE_NAME)}</g:brand>
    <g:mpn>${xmlEscape(variant.sku)}</g:mpn>
    <g:condition>new</g:condition>
    <g:color>${xmlEscape(colorValue.value)}</g:color>
    <g:size>${xmlEscape(sizeValue.value)}</g:size>
    <g:gender>unisex</g:gender>
    <g:age_group>adult</g:age_group>
    ${product.category ? `<g:product_type>${xmlEscape(product.category.name)}</g:product_type>` : ""}
  </item>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>${xmlEscape(SITE_NAME)} — Product Feed</title>
  <link>${xmlEscape(absoluteUrl("/"))}</link>
  <description>Live product feed for Google Merchant Center.</description>
${items.join("\n")}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
