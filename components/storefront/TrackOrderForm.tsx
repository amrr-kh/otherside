"use client";

import { useActionState } from "react";
import { trackOrderAction, type TrackOrderState } from "@/lib/actions/tracking";

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Order Received",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

const STATUS_ORDER = [
  "RECEIVED",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const initialState: TrackOrderState = { status: "idle" };

export function TrackOrderForm() {
  const [state, formAction, isPending] = useActionState(
    trackOrderAction,
    initialState,
  );

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4 sm:flex-row">
        <input
          name="orderNumber"
          placeholder="Order Number (e.g. OS-10001)"
          required
          className="flex-1 border border-warm-white/25 bg-transparent px-4 py-3 text-sm text-warm-white placeholder:text-warm-white/35 focus:border-electric-violet focus:outline-none"
        />
        <input
          name="phone"
          placeholder="Phone Number"
          required
          className="flex-1 border border-warm-white/25 bg-transparent px-4 py-3 text-sm text-warm-white placeholder:text-warm-white/35 focus:border-electric-violet focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="border border-warm-white/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg disabled:opacity-50"
        >
          {isPending ? "Searching…" : "Track Order"}
        </button>
      </form>

      {state.status === "error" ? (
        <p className="mt-4 text-sm text-magenta">{state.message}</p>
      ) : null}

      {state.status === "found" ? (
        <div className="mt-12 border-t border-warm-white/10 pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl italic text-warm-white">
              Order {state.order.orderNumber}
            </h2>
            <span className="text-sm text-gold">
              EGP {state.order.total.toLocaleString()}
            </span>
          </div>

          {state.order.trackingNumber ? (
            <p className="mt-2 text-sm text-warm-white/50">
              Tracking number: {state.order.trackingNumber}
            </p>
          ) : null}

          <ul className="mt-6 space-y-2 text-sm text-warm-white/60">
            {state.order.items.map((item, i) => (
              <li key={i}>
                {item.name} — {item.color} / {item.size} × {item.quantity}
              </li>
            ))}
          </ul>

          {state.order.status === "CANCELLED" ||
          state.order.status === "RETURNED" ? (
            <p className="mt-8 text-sm text-orange">
              This order was {STATUS_LABELS[state.order.status].toLowerCase()}.
            </p>
          ) : (
            <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {STATUS_ORDER.map((step) => {
                const reached =
                  STATUS_ORDER.indexOf(step) <=
                  STATUS_ORDER.indexOf(state.order.status);
                return (
                  <li
                    key={step}
                    className={`text-xs uppercase tracking-[0.1em] ${
                      reached ? "text-warm-white" : "text-warm-white/25"
                    }`}
                  >
                    {STATUS_LABELS[step]}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      ) : null}
    </div>
  );
}
