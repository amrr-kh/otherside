"use client";

import { useSyncExternalStore } from "react";

type Clock = {
  /** The server-aligned current time, in ms since epoch. */
  now: number;
  /** False until the one-time server time check has finished (or failed). */
  synced: boolean;
};

// One shared clock for every countdown on the page: a single timer that ticks
// on the second, and a single request to /api/server-time. Nothing here talks
// to the server again after that; the deadline itself comes from the database
// through the page, and the ticking is pure client-side arithmetic.
let offsetMs = 0;
let synced = false;
let syncStarted = false;
let snapshot: Clock | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function publish() {
  snapshot = { now: Date.now() + offsetMs, synced };
  for (const listener of listeners) listener();
}

function scheduleNextTick() {
  // Land on the next whole second of the server-aligned clock so the seconds
  // digit changes crisply and never drifts.
  const wait = 1000 - ((Date.now() + offsetMs) % 1000);
  timer = setTimeout(() => {
    publish();
    if (listeners.size > 0) scheduleNextTick();
  }, wait);
}

async function syncWithServer() {
  if (syncStarted) return;
  syncStarted = true;
  try {
    const sentAt = Date.now();
    const response = await fetch("/api/server-time", { cache: "no-store" });
    const receivedAt = Date.now();
    if (response.ok) {
      const data: unknown = await response.json();
      if (
        data &&
        typeof data === "object" &&
        "now" in data &&
        typeof data.now === "number"
      ) {
        // The server stamped `now` about halfway through the round trip.
        offsetMs = data.now - (sentAt + (receivedAt - sentAt) / 2);
      }
    }
  } catch {
    // Offline or blocked: fall back to the device clock.
  }
  synced = true;
  publish();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    scheduleNextTick();
    void syncWithServer();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };
}

/**
 * The server-aligned clock, or null during server rendering / before the first
 * tick. Components render fixed-width placeholders while it is null or not yet
 * synced, so the first paint matches the server HTML and nothing shifts.
 */
export function usePromotionClock(): Clock | null {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => null,
  );
}
