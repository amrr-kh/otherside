import { absoluteUrl } from "@/lib/seo";

const SITE_URL = absoluteUrl("");

export const dynamic = "force-static";

// Plain-text summary for AI search and answer engines (the llms.txt convention).
const body = `# OtherSide

> OtherSide is an Egyptian unisex fashion brand selling oversized hoodies and wide-leg pants online, designed for comfort, individuality and a different perspective.

## Shop
- [Hoodies](${SITE_URL}/hoodies): oversized unisex hoodies, sizes S to XL, several colours
- [Pants](${SITE_URL}/pants): fluid wide-leg unisex pants, sizes S to XL, several colours
- [The Veil Study](${SITE_URL}/collections/the-veil-study): the current collection
- [Create Your Own](${SITE_URL}/create-your-own): custom pieces

## Good to know
- Online store based in Egypt; prices are in Egyptian pounds (EGP)
- Payment: cash on delivery, InstaPay and mobile wallets
- Languages: English and Arabic (Arabic pages start with ${SITE_URL}/ar)
- [Shipping](${SITE_URL}/shipping), [Returns](${SITE_URL}/returns), [Contact](${SITE_URL}/contact), [Our story](${SITE_URL}/story)
- Order tracking: ${SITE_URL}/track-order
`;

export function GET() {
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
