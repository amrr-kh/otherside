import { TrackOrderForm } from "@/components/storefront/TrackOrderForm";

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        Order Status
      </p>
      <h1 className="mt-5 font-display text-4xl italic text-warm-white md:text-5xl">
        Track Your Order
      </h1>
      <p className="mt-4 max-w-md text-sm text-warm-white/55">
        Enter your order number and the phone number used at checkout.
      </p>

      <div className="mt-10">
        <TrackOrderForm />
      </div>
    </div>
  );
}
