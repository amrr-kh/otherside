type EventParams = Record<string, string | number>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends an event to whichever Google tag the site has installed: gtag.js
 * (GA4) when present, otherwise the Google Tag Manager dataLayer. Does
 * nothing when neither exists, so it is safe to call before analytics is
 * installed — and never sends both, which would double-count.
 */
export function trackEvent(name: string, params: EventParams): void {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
    return;
  }
  window.dataLayer?.push({ event: name, ...params });
}
