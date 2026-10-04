import "server-only";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

/**
 * Server-only Google Analytics 4 Data API client, for the admin "Website
 * Traffic" dashboard. Never imported by anything the browser loads — the
 * service-account key never leaves the server.
 *
 * Configuration (both required, else every function below returns null and
 * the dashboard shows "Analytics temporarily unavailable" instead of
 * breaking): GA4_PROPERTY_ID, GA4_SERVICE_ACCOUNT_KEY (the service account's
 * JSON key file, base64-encoded into one string — see the admin onboarding
 * notes for exactly how to create it).
 */

type Row = { dimensionValues?: { value?: string | null }[] | null; metricValues?: { value?: string | null }[] | null };

let cachedClient: BetaAnalyticsDataClient | null | undefined;

function getClient(): BetaAnalyticsDataClient | null {
  if (cachedClient !== undefined) return cachedClient;
  const keyB64 = process.env.GA4_SERVICE_ACCOUNT_KEY;
  if (!keyB64 || !process.env.GA4_PROPERTY_ID) {
    cachedClient = null;
    return cachedClient;
  }
  try {
    const credentials = JSON.parse(Buffer.from(keyB64, "base64").toString("utf8"));
    cachedClient = new BetaAnalyticsDataClient({ credentials });
  } catch (error) {
    console.error("ga4: GA4_SERVICE_ACCOUNT_KEY is not valid base64-encoded JSON", error);
    cachedClient = null;
  }
  return cachedClient;
}

function propertyPath(): string {
  return `properties/${process.env.GA4_PROPERTY_ID}`;
}

// Per-process in-memory cache (serverless instances are reused while warm).
// GA4 is always the source of truth; this just avoids hammering it, per the
// 30-60s realtime / 5-15min historical guidance.
const resultCache = new Map<string, { at: number; value: unknown }>();
async function withCache<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const hit = resultCache.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as T;
  const value = await fetcher();
  resultCache.set(key, { at: Date.now(), value });
  return value;
}

const num = (row: Row | undefined, i = 0) => Number(row?.metricValues?.[i]?.value ?? 0);
const dim = (row: Row, i = 0) => row.dimensionValues?.[i]?.value ?? "";

export type TrafficRange = "7d" | "30d";

export type WebsiteTraffic = {
  todayVisitors: number;
  todaySessions: number;
  todayPageViews: number;
  last7Visitors: number;
  last30Visitors: number;
  rangeSessions: number;
  daily: { date: string; visitors: number }[];
  topPages: { path: string; views: number }[];
  sources: { label: string; sessions: number }[];
  devices: { category: string; sessions: number }[];
  countries: { country: string; visitors: number }[];
};

/** Buckets a raw GA4 session source into the handful of channels the dashboard shows. */
function bucketSource(source: string): string {
  const s = source.toLowerCase();
  if (s === "(direct)") return "Direct";
  if (s.includes("google")) return "Google";
  if (s.includes("instagram")) return "Instagram";
  if (s.includes("tiktok")) return "TikTok";
  if (s.includes("facebook") || s === "fb" || s === "m.facebook.com") return "Facebook";
  if (s.includes("whatsapp")) return "WhatsApp";
  return "Other";
}

export async function getWebsiteTraffic(range: TrafficRange): Promise<WebsiteTraffic | null> {
  const client = getClient();
  if (!client) return null;

  return withCache(`traffic:${range}`, 10 * 60 * 1000, async () => {
    const days = range === "7d" ? 7 : 30;
    const rangeStart = `${days - 1}daysAgo`;

    const requests = [
      {
        dateRanges: [{ startDate: "today", endDate: "today" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
      },
      {
        dateRanges: [{ startDate: "6daysAgo", endDate: "today" }],
        metrics: [{ name: "activeUsers" }],
      },
      {
        dateRanges: [{ startDate: "29daysAgo", endDate: "today" }],
        metrics: [{ name: "activeUsers" }],
      },
      {
        dateRanges: [{ startDate: rangeStart, endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      },
      {
        dateRanges: [{ startDate: rangeStart, endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      },
      {
        dateRanges: [{ startDate: rangeStart, endDate: "today" }],
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 15,
      },
      {
        dateRanges: [{ startDate: rangeStart, endDate: "today" }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      },
      {
        dateRanges: [{ startDate: rangeStart, endDate: "today" }],
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 5,
      },
      {
        dateRanges: [{ startDate: rangeStart, endDate: "today" }],
        metrics: [{ name: "sessions" }],
      },
    ];

    // The Data API allows at most 5 reports per batch call, so send two in parallel.
    const [first, second] = await Promise.all([
      client.batchRunReports({ property: propertyPath(), requests: requests.slice(0, 5) }),
      client.batchRunReports({ property: propertyPath(), requests: requests.slice(5) }),
    ]);

    const [todayR, last7R, last30R, dailyR, topPagesR] = first[0].reports ?? [];
    const [sourcesR, devicesR, countriesR, rangeSessionsR] = second[0].reports ?? [];

    const sourceTotals = new Map<string, number>();
    for (const row of sourcesR?.rows ?? []) {
      const label = bucketSource(dim(row));
      sourceTotals.set(label, (sourceTotals.get(label) ?? 0) + num(row));
    }

    return {
      todayVisitors: num(todayR?.rows?.[0], 0),
      todaySessions: num(todayR?.rows?.[0], 1),
      todayPageViews: num(todayR?.rows?.[0], 2),
      last7Visitors: num(last7R?.rows?.[0]),
      last30Visitors: num(last30R?.rows?.[0]),
      rangeSessions: num(rangeSessionsR?.rows?.[0]),
      daily: (dailyR?.rows ?? []).map((row) => {
        const raw = dim(row); // YYYYMMDD
        return {
          date: `${raw.slice(4, 6)}/${raw.slice(6, 8)}`,
          visitors: num(row),
        };
      }),
      topPages: (topPagesR?.rows ?? []).map((row) => ({ path: dim(row) || "/", views: num(row) })),
      sources: Array.from(sourceTotals.entries())
        .map(([label, sessions]) => ({ label, sessions }))
        .sort((a, b) => b.sessions - a.sessions),
      devices: (devicesR?.rows ?? []).map((row) => ({
        category: dim(row) || "unknown",
        sessions: num(row),
      })),
      countries: (countriesR?.rows ?? []).map((row) => ({
        country: dim(row) || "Unknown",
        visitors: num(row),
      })),
    };
  }).catch((error) => {
    console.error("ga4: getWebsiteTraffic failed", error);
    return null;
  });
}

export async function getRealtimeVisitors(): Promise<number | null> {
  const client = getClient();
  if (!client) return null;

  try {
    return await withCache("realtime", 45 * 1000, async () => {
      const [resp] = await client.runRealtimeReport({
        property: propertyPath(),
        metrics: [{ name: "activeUsers" }],
      });
      return num(resp.rows?.[0]);
    });
  } catch (error) {
    console.error("ga4: getRealtimeVisitors failed", error);
    return null;
  }
}

/** True once both required env vars are present and the key parses — used to show setup vs. outage messaging. */
export function isGa4Configured(): boolean {
  return getClient() !== null;
}
