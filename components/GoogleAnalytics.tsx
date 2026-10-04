import Script from "next/script";

// The measurement ID is public (it ships to every visitor's browser), so it is
// safe to keep in the code. Set NEXT_PUBLIC_GA_MEASUREMENT_ID to override it.
const MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-R6XTDVYDFJ";

// Visitors from these regions are not measured until they consent, and the
// site has no consent banner yet, so they are simply not counted.
const CONSENT_REQUIRED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO", "GB", "CH",
];

/**
 * Google Analytics 4. Only renders on the live production site, so local
 * development and Vercel preview builds never add fake visits. It is mounted in
 * the storefront layout only, so the admin area is never tracked.
 */
export function GoogleAnalytics() {
  if (process.env.VERCEL_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            region: ${JSON.stringify(CONSENT_REQUIRED_REGIONS)}
          });
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
