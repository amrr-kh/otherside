export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        Delivery
      </p>
      <h1 className="mt-5 font-display text-4xl italic text-warm-white md:text-5xl">
        Shipping
      </h1>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-warm-white/60">
        <p>
          We currently deliver across Egypt. Shipping cost and estimated
          delivery time depend on your governorate and are shown at
          checkout before you place your order.
        </p>
        <p>
          Every order is confirmed by phone or WhatsApp before it ships, so
          please make sure the number you provide at checkout is correct
          and reachable.
        </p>
        <p>
          Payment on delivery is available across Egypt. We also accept
          InstaPay and Egyptian mobile wallet transfers — both are shown as
          options at checkout.
        </p>
        <p>
          Questions about a specific delivery? Reach us on{" "}
          <a
            href="https://wa.me/201559002289"
            target="_blank"
            rel="noopener noreferrer"
            className="text-warm-white underline underline-offset-4 hover:text-electric-violet"
          >
            WhatsApp
          </a>{" "}
          and we&apos;ll help directly.
        </p>
      </div>
    </div>
  );
}
