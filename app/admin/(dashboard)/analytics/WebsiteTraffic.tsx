"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { fetchRealtimeVisitors, fetchWebsiteTraffic } from "./actions";
import type { TrafficRange, WebsiteTraffic as Traffic } from "@/lib/analytics/ga4";

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-soft-black/10 bg-white px-5 py-4">
      <p className="text-xs uppercase tracking-[0.1em] text-soft-black/45">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-soft-black">{value}</p>
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  displayValue,
}: {
  label: string;
  value: number;
  max: number;
  displayValue?: string;
}) {
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 2 : 0) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-40 shrink-0 truncate text-soft-black/60" title={label}>
        {label}
      </span>
      <div className="h-5 flex-1 rounded bg-soft-black/5">
        <div
          className="h-full rounded bg-electric-violet/70"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-14 shrink-0 text-right text-soft-black/70">
        {displayValue ?? value.toLocaleString()}
      </span>
    </div>
  );
}

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Mobile",
  desktop: "Desktop",
  tablet: "Tablet",
};

/**
 * Website Traffic section of /admin/analytics. Server-rendered with the
 * 7-day view on first load (`initial`/`initialRange` props below); the
 * 7/30-day toggle and the "online now" count both go back to the server on
 * their own schedule (see the GA4_* caching notes in lib/analytics/ga4.ts).
 */
export function WebsiteTraffic({
  initial,
  initialRange,
  configured,
  ordersToday,
}: {
  initial: Traffic | null;
  initialRange: TrafficRange;
  configured: boolean;
  ordersToday: number;
}) {
  const [range, setRange] = useState<TrafficRange>(initialRange);
  const [data, setData] = useState<Traffic | null>(initial);
  const [online, setOnline] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const rangeCache = useRef(new Map<TrafficRange, Traffic | null>([[initialRange, initial]]));

  function handleRangeChange(next: TrafficRange) {
    setRange(next);
    const cached = rangeCache.current.get(next);
    if (cached) {
      setData(cached);
      return;
    }
    startTransition(async () => {
      const result = await fetchWebsiteTraffic(next);
      rangeCache.current.set(next, result);
      setData(result);
    });
  }

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    const poll = async () => {
      const count = await fetchRealtimeVisitors().catch(() => null);
      if (!cancelled) setOnline(count);
    };
    poll();
    const id = setInterval(poll, 45_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [configured]);

  if (!configured) {
    return (
      <div className="mt-8 rounded-lg border border-soft-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold text-soft-black">Website Traffic</h2>
        <p className="mt-3 max-w-xl text-sm text-soft-black/50">
          Google Analytics isn&apos;t connected to the admin dashboard yet. The
          storefront tag (G-R6XTDVYDFJ) keeps recording visits either way —
          this panel just needs GA4_PROPERTY_ID and GA4_SERVICE_ACCOUNT_KEY
          set in Vercel to start showing them here.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-8 rounded-lg border border-soft-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold text-soft-black">Website Traffic</h2>
        <p className="mt-3 text-sm text-soft-black/50">
          Analytics temporarily unavailable. The rest of this dashboard is
          unaffected — try again in a few minutes.
        </p>
      </div>
    );
  }

  const maxDaily = Math.max(...data.daily.map((d) => d.visitors), 1);
  const maxPageViews = Math.max(...data.topPages.map((p) => p.views), 1);
  const maxSourceSessions = Math.max(...data.sources.map((s) => s.sessions), 1);
  const maxDeviceSessions = Math.max(...data.devices.map((d) => d.sessions), 1);
  const maxCountryVisitors = Math.max(...data.countries.map((c) => c.visitors), 1);
  const conversionRate =
    data.todaySessions > 0 ? ((ordersToday / data.todaySessions) * 100).toFixed(1) : null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-soft-black">Website Traffic</h2>
        <div className="flex gap-1 rounded-md border border-soft-black/10 p-0.5 text-xs">
          {(["7d", "30d"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRangeChange(r)}
              className={`rounded px-2.5 py-1 ${
                range === r
                  ? "bg-soft-black text-warm-white"
                  : "text-soft-black/55 hover:bg-soft-black/5"
              }`}
            >
              {r === "7d" ? "7 Days" : "30 Days"}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-soft-black/40">
        From Google Analytics 4. Real-time refreshes about every 45 seconds;
        the rest about every 10 minutes.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Card label="Online Now" value={online ?? "—"} />
        <Card label="Visitors Today" value={data.todayVisitors.toLocaleString()} />
        <Card label="Sessions Today" value={data.todaySessions.toLocaleString()} />
        <Card label="Page Views Today" value={data.todayPageViews.toLocaleString()} />
        <Card label="Visitors — 7 Days" value={data.last7Visitors.toLocaleString()} />
        <Card label="Visitors — 30 Days" value={data.last30Visitors.toLocaleString()} />
      </div>

      <div className={`mt-6 rounded-lg border border-soft-black/10 bg-white p-5 ${isPending ? "opacity-60" : ""}`}>
        <h3 className="text-sm font-semibold text-soft-black">
          Visitors — {range === "7d" ? "Last 7 Days" : "Last 30 Days"}
        </h3>
        {data.daily.every((d) => d.visitors === 0) ? (
          <p className="mt-3 text-sm text-soft-black/50">No visitors recorded yet.</p>
        ) : (
          <>
            <div className="mt-4 flex gap-1" style={{ height: 140 }}>
              {data.daily.map((d, i) => (
                <div
                  key={`${d.date}-${i}`}
                  className="group relative flex flex-1 flex-col items-center justify-end"
                >
                  <div
                    className="w-full rounded-sm bg-electric-violet/70"
                    style={{
                      height: `${Math.max((d.visitors / maxDaily) * 100, d.visitors > 0 ? 3 : 0)}%`,
                    }}
                  />
                  <span className="pointer-events-none absolute -top-6 hidden whitespace-nowrap rounded bg-soft-black px-1.5 py-0.5 text-[10px] text-warm-white group-hover:block">
                    {d.visitors.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-1 text-[10px] text-soft-black/40">
              {data.daily.map((d, i) => (
                <span key={`${d.date}-${i}`} className="flex-1 text-center">
                  {range === "7d" || i % 4 === 0 ? d.date : ""}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h3 className="text-sm font-semibold text-soft-black">Top Pages</h3>
          <div className="mt-4 flex flex-col gap-3">
            {data.topPages.length === 0 ? (
              <p className="text-sm text-soft-black/50">No page views yet.</p>
            ) : (
              data.topPages.map((p) => (
                <Bar key={p.path} label={p.path} value={p.views} max={maxPageViews} />
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h3 className="text-sm font-semibold text-soft-black">Traffic Sources</h3>
          <div className="mt-4 flex flex-col gap-3">
            {data.sources.length === 0 ? (
              <p className="text-sm text-soft-black/50">No sessions yet.</p>
            ) : (
              data.sources.map((s) => (
                <Bar key={s.label} label={s.label} value={s.sessions} max={maxSourceSessions} />
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h3 className="text-sm font-semibold text-soft-black">Device</h3>
          <div className="mt-4 flex flex-col gap-3">
            {data.devices.length === 0 ? (
              <p className="text-sm text-soft-black/50">No sessions yet.</p>
            ) : (
              data.devices.map((d) => (
                <Bar
                  key={d.category}
                  label={DEVICE_LABELS[d.category] ?? d.category}
                  value={d.sessions}
                  max={maxDeviceSessions}
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h3 className="text-sm font-semibold text-soft-black">Top Countries</h3>
          <div className="mt-4 flex flex-col gap-3">
            {data.countries.length === 0 ? (
              <p className="text-sm text-soft-black/50">No visitors yet.</p>
            ) : (
              data.countries.map((c) => (
                <Bar
                  key={c.country}
                  label={c.country}
                  value={c.visitors}
                  max={maxCountryVisitors}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-soft-black/10 bg-white p-5">
        <h3 className="text-sm font-semibold text-soft-black">Conversion Rate</h3>
        <p className="mt-2 text-2xl font-semibold text-soft-black">
          {conversionRate !== null ? `${conversionRate}%` : "—"}
        </p>
        <p className="mt-1 text-xs text-soft-black/40">
          Orders today ({ordersToday.toLocaleString()}) ÷ sessions today (
          {data.todaySessions.toLocaleString()}). GA4 sessions aren&apos;t
          matched to individual orders, so this is a site-wide rate, not
          per-visitor attribution.
        </p>
      </div>
    </div>
  );
}
