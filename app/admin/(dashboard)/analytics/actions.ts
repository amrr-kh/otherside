"use server";

import { requireAdmin } from "@/lib/require-admin";
import {
  getRealtimeVisitors,
  getWebsiteTraffic,
  type TrafficRange,
} from "@/lib/analytics/ga4";

// Read-only, but still admin-gated: this is real visitor data, not something
// to expose past the login wall. requireAdmin() checks the session itself
// rather than trusting the page shell around it (see lib/require-admin.ts).

export async function fetchWebsiteTraffic(range: TrafficRange) {
  await requireAdmin();
  return getWebsiteTraffic(range);
}

export async function fetchRealtimeVisitors() {
  await requireAdmin();
  return getRealtimeVisitors();
}
