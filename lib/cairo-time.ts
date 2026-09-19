// Business time for OtherSide is Egypt (Africa/Cairo), which observes daylight
// saving time. Promotion deadlines are stored as absolute instants (UTC in the
// database); these helpers convert to and from what an admin types and what a
// customer reads, using the real timezone rules rather than a fixed offset.

export const BUSINESS_TIME_ZONE = "Africa/Cairo";

const wallClock = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function cairoParts(utcMs: number) {
  const out: Record<string, number> = {};
  for (const part of wallClock.formatToParts(new Date(utcMs))) {
    if (part.type !== "literal") out[part.type] = Number(part.value);
  }
  return out;
}

/** Cairo's offset from UTC, in ms, at the given instant (+2h winter, +3h summer). */
function cairoOffsetMs(utcMs: number): number {
  const p = cairoParts(utcMs);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

const LOCAL_INPUT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

/**
 * Converts what an admin typed into a <input type="datetime-local"> — a Cairo
 * wall-clock time such as "2026-09-23T23:59" — into the real UTC instant.
 * Returns null for anything that isn't a valid date/time.
 */
export function cairoLocalToUtc(local: string): Date | null {
  const match = LOCAL_INPUT.exec(local.trim());
  if (!match) return null;
  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  const check = new Date(wall);
  // Rejects things like 2026-02-31 that Date.UTC would silently roll over.
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day ||
    check.getUTCHours() !== hour ||
    check.getUTCMinutes() !== minute
  ) {
    return null;
  }

  // The offset depends on the instant we are solving for, so settle it in two
  // passes (this also handles wall times right next to a DST change).
  let utc = wall - cairoOffsetMs(wall);
  const corrected = wall - cairoOffsetMs(utc);
  if (corrected !== utc) utc = corrected;
  return new Date(utc);
}

/** The reverse: a UTC instant as "YYYY-MM-DDTHH:mm" in Cairo time, for a form field. */
export function utcToCairoLocal(date: Date): string {
  const p = cairoParts(date.getTime());
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

/**
 * Human-readable deadline in Cairo time, e.g. "September 23 at 11:59 PM"
 * (English) or the Arabic equivalent. Used for the accessible label, so it
 * never changes while the visual countdown ticks.
 */
export function formatCairoDeadline(date: Date, locale: string): string {
  if (locale === "ar") {
    return new Intl.DateTimeFormat("ar-EG", {
      timeZone: BUSINESS_TIME_ZONE,
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("month")} ${get("day")} at ${get("hour")}:${get("minute")} ${get("dayPeriod")}`;
}
