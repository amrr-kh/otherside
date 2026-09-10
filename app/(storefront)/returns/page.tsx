export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        Policy
      </p>
      <h1 className="mt-5 font-display text-4xl italic text-warm-white md:text-5xl">
        Returns & Exchanges
      </h1>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-warm-white/60">
        <p>
          Unworn items in their original condition, with tags attached, can
          be returned or exchanged within 14 days of delivery.
        </p>
        <p>
          To start a return or exchange, message us on WhatsApp with your
          order number and which item you&apos;d like to return — we&apos;ll
          walk you through the next steps from there.
        </p>
        <p>
          Items that are worn, washed, altered, or without original tags
          can&apos;t be accepted. Custom or made-to-order pieces from{" "}
          <a
            href="/create-your-own"
            className="text-warm-white underline underline-offset-4 hover:text-electric-violet"
          >
            Create Your Own
          </a>{" "}
          are final sale.
        </p>
        <p>
          Questions before you buy? Reach us on{" "}
          <a
            href="https://wa.me/201559002289"
            target="_blank"
            rel="noopener noreferrer"
            className="text-warm-white underline underline-offset-4 hover:text-electric-violet"
          >
            WhatsApp
          </a>{" "}
          — sizing help included.
        </p>
      </div>
    </div>
  );
}
