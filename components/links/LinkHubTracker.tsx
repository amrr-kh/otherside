"use client";

import type { MouseEvent, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * One delegated click handler for the whole link hub, so each click is
 * reported exactly once and the page ships no per-link JavaScript.
 * Reads only non-personal data attributes set by HubLink.
 */
export function LinkHubTracker({ children }: { children: ReactNode }) {
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest<HTMLAnchorElement>("a[data-hub-link]");
    if (!link) return;

    trackEvent("link_hub_click", {
      link_name: link.dataset.hubLink ?? "",
      destination: (link.getAttribute("href") ?? "").split("?")[0],
      section: link.dataset.hubSection ?? "",
      position: Number(link.dataset.hubPosition ?? 0),
    });
  }

  return <div onClick={handleClick}>{children}</div>;
}
