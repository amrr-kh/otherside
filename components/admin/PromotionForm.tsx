"use client";

import { useEffect, useRef, useState } from "react";
import { PromotionBarView } from "@/components/storefront/promotion/PromotionBarView";
import type { CountdownLabels } from "@/components/storefront/promotion/CountdownDigits";

export type PromotionFormValues = {
  isActive: boolean;
  title: string;
  message: string;
  ctaText: string;
  ctaUrl: string;
  titleAr: string;
  messageAr: string;
  ctaTextAr: string;
  /** Cairo wall-clock time, "YYYY-MM-DDTHH:mm". */
  startsAt: string;
  endsAt: string;
  showTopBar: boolean;
  showOnProductPages: boolean;
  /** Empty string = no price change; otherwise a whole number 1-90. */
  discountPercent: string;
  scope: "STORE" | "COLLECTIONS" | "PRODUCTS";
  productIds: string[];
  collectionIds: string[];
};

type Option = { id: string; name: string };
type LinkSuggestion = { value: string; label: string };

const inputClass =
  "w-full rounded border border-soft-black/15 bg-white px-3 py-2 text-sm text-soft-black focus:border-electric-violet focus:outline-none";
const labelClass = "mb-1 block text-xs text-soft-black/50";
const sectionClass = "rounded-lg border border-soft-black/10 bg-white p-5";

const PREVIEW_LABELS: CountdownLabels = {
  days: "Days",
  hours: "Hrs",
  minutes: "Min",
  seconds: "Sec",
  daysShort: "D",
  hoursShort: "H",
  minutesShort: "M",
  secondsShort: "S",
};

// A fixed sample so the preview shows the layout without ticking or lying
// about the real remaining time.
const PREVIEW_PARTS = { days: "02", hours: "14", minutes: "36", seconds: "18" };

export function PromotionForm({
  action,
  submitLabel,
  defaultValues,
  products,
  collections,
  linkSuggestions,
}: {
  action: (formData: FormData) => void;
  submitLabel: string;
  defaultValues: PromotionFormValues;
  products: Option[];
  collections: Option[];
  linkSuggestions: LinkSuggestion[];
}) {
  const [title, setTitle] = useState(defaultValues.title);
  const [message, setMessage] = useState(defaultValues.message);
  const [ctaText, setCtaText] = useState(defaultValues.ctaText);
  const [startsAt, setStartsAt] = useState(defaultValues.startsAt);
  const [endsAt, setEndsAt] = useState(defaultValues.endsAt);
  const [scope, setScope] = useState(defaultValues.scope);
  const [percent, setPercent] = useState(defaultValues.discountPercent);
  const endRef = useRef<HTMLInputElement>(null);

  const percentNum = Number(percent);
  const hasPercent = percent.trim() !== "";
  const percentValid =
    hasPercent &&
    Number.isInteger(percentNum) &&
    percentNum >= 1 &&
    percentNum <= 90;

  const endBeforeStart = startsAt !== "" && endsAt !== "" && endsAt <= startsAt;
  useEffect(() => {
    endRef.current?.setCustomValidity(
      endBeforeStart ? "The end must be after the start." : "",
    );
  }, [endBeforeStart]);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-6">
      <section className={sectionClass}>
        <h2 className="text-sm font-semibold text-soft-black">Preview</h2>
        <p className="mt-1 text-xs text-soft-black/50">
          Roughly how the bar looks on the website (sample numbers, they do not
          tick here). On phones the message is hidden to keep the bar slim.
        </p>
        <div className="mt-4 overflow-hidden rounded">
          <PromotionBarView
            title={title.trim() || "LIMITED OFFER"}
            percentBadge={percentValid ? `${percentNum}% OFF` : null}
            message={message.trim() || null}
            endsInLabel="Ends in"
            endsLabel=""
            parts={PREVIEW_PARTS}
            labels={PREVIEW_LABELS}
            cta={
              <span className="inline-flex items-center gap-1.5">
                {ctaText.trim() || "SHOP NOW"} →
              </span>
            }
          />
        </div>
      </section>

      <section className={sectionClass}>
        <label className="flex items-center gap-3 text-sm font-medium text-soft-black">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={defaultValues.isActive}
            className="h-4 w-4"
          />
          Active: show this offer on the website
        </label>
        <p className="mt-2 text-xs text-soft-black/50">
          Switched off, nothing appears anywhere. Switched on, it only shows
          between the start and end below.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className="text-sm font-semibold text-soft-black">Message</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              maxLength={60}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="LIMITED OFFER"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="message" className={labelClass}>
              Short message (optional, shown on wide screens)
            </label>
            <input
              id="message"
              name="message"
              maxLength={160}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="THE DROP WON'T STAY THIS WAY FOREVER."
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ctaText" className={labelClass}>
                Button text
              </label>
              <input
                id="ctaText"
                name="ctaText"
                required
                maxLength={30}
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="SHOP NOW"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="ctaUrl" className={labelClass}>
                Button link
              </label>
              <input
                id="ctaUrl"
                name="ctaUrl"
                required
                dir="ltr"
                list="cta-suggestions"
                defaultValue={defaultValues.ctaUrl}
                pattern="(/(?!/)[^\s\\]*)|(https://[^\s\\]+)"
                title="A page on this site like /hoodies, or a full https:// link"
                placeholder="/hoodies"
                className={inputClass}
              />
              <datalist id="cta-suggestions">
                {linkSuggestions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </datalist>
            </div>
          </div>
        </div>

        <details className="mt-5">
          <summary className="cursor-pointer text-xs font-medium uppercase tracking-[0.1em] text-soft-black/60">
            Arabic version (optional)
          </summary>
          <p className="mt-2 text-xs text-soft-black/50">
            Shown on the Arabic site. Leave empty to reuse the English text.
          </p>
          <div className="mt-3 flex flex-col gap-4">
            <div>
              <label htmlFor="titleAr" className={labelClass}>
                Title (Arabic)
              </label>
              <input
                id="titleAr"
                name="titleAr"
                dir="rtl"
                maxLength={60}
                defaultValue={defaultValues.titleAr}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="messageAr" className={labelClass}>
                Short message (Arabic)
              </label>
              <input
                id="messageAr"
                name="messageAr"
                dir="rtl"
                maxLength={160}
                defaultValue={defaultValues.messageAr}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="ctaTextAr" className={labelClass}>
                Button text (Arabic)
              </label>
              <input
                id="ctaTextAr"
                name="ctaTextAr"
                dir="rtl"
                maxLength={30}
                defaultValue={defaultValues.ctaTextAr}
                className={inputClass}
              />
            </div>
          </div>
        </details>
      </section>

      <section className={sectionClass}>
        <h2 className="text-sm font-semibold text-soft-black">When</h2>
        <p className="mt-1 text-xs text-soft-black/50">
          Enter Egypt time (Cairo). The same deadline applies to every customer
          on every device, and it never restarts.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="startsAt" className={labelClass}>
              Starts
            </label>
            <input
              id="startsAt"
              name="startsAt"
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="endsAt" className={labelClass}>
              Ends
            </label>
            <input
              ref={endRef}
              id="endsAt"
              name="endsAt"
              type="datetime-local"
              required
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        {endBeforeStart ? (
          <p className="mt-2 text-xs text-magenta">
            The end must be after the start.
          </p>
        ) : null}
      </section>

      <section className={sectionClass}>
        <h2 className="text-sm font-semibold text-soft-black">
          Percentage off (optional)
        </h2>
        <p className="mt-1 text-xs text-soft-black/50">
          Leave empty for a countdown that only shows a message. Type a number
          to also lower prices by that percent while the offer is live. The
          reduction applies to the products chosen under &quot;Applies to&quot;
          below.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <input
            id="discountPercent"
            name="discountPercent"
            type="number"
            inputMode="numeric"
            min={1}
            max={90}
            step={1}
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            placeholder="e.g. 20"
            className={`${inputClass} max-w-28`}
          />
          <span className="text-sm text-soft-black/60">% off (1 to 90)</span>
        </div>
        {hasPercent && !percentValid ? (
          <p className="mt-2 text-xs text-magenta">
            Use a whole number from 1 to 90.
          </p>
        ) : null}
        {percentValid ? (
          <p className="mt-2 text-xs text-soft-black/60">
            Example: a product at EGP 950 will show EGP 950 crossed out and sell
            for EGP {Math.max(1, Math.round((950 * (100 - percentNum)) / 100)).toLocaleString("en-US")}{" "}
            while the offer is live. A product that already has a Sale Price
            keeps its original price crossed out, and the percentage is taken
            off its current price. It never stacks with another live offer (the
            bigger percentage wins). Discount codes still work on top.
          </p>
        ) : null}
      </section>

      <section className={sectionClass}>
        <h2 className="text-sm font-semibold text-soft-black">
          Where it appears
        </h2>
        <div className="mt-4 flex flex-col gap-3 text-sm text-soft-black/80">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="showTopBar"
              defaultChecked={defaultValues.showTopBar}
              className="h-4 w-4"
            />
            Slim bar at the top of every page
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="showOnProductPages"
              defaultChecked={defaultValues.showOnProductPages}
              className="h-4 w-4"
            />
            Small timer on product pages
          </label>
        </div>

        <fieldset className="mt-6">
          <legend className="text-xs font-medium uppercase tracking-[0.1em] text-soft-black/60">
            Applies to (product-page timer and the percentage off)
          </legend>
          <div className="mt-3 flex flex-col gap-2 text-sm text-soft-black/80">
            {(
              [
                ["STORE", "The entire store"],
                ["COLLECTIONS", "Specific collections"],
                ["PRODUCTS", "Specific products"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="scope"
                  value={value}
                  checked={scope === value}
                  onChange={() => setScope(value)}
                  className="h-4 w-4"
                />
                {label}
              </label>
            ))}
          </div>

          {scope === "COLLECTIONS" ? (
            <div className="mt-4 flex flex-col gap-2 rounded border border-soft-black/10 p-3 text-sm">
              {collections.length === 0 ? (
                <p className="text-soft-black/50">No collections yet.</p>
              ) : (
                collections.map((c) => (
                  <label key={c.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="collectionIds"
                      value={c.id}
                      defaultChecked={defaultValues.collectionIds.includes(c.id)}
                      className="h-4 w-4"
                    />
                    {c.name}
                  </label>
                ))
              )}
            </div>
          ) : null}

          {scope === "PRODUCTS" ? (
            <div className="mt-4 flex flex-col gap-2 rounded border border-soft-black/10 p-3 text-sm">
              {products.length === 0 ? (
                <p className="text-soft-black/50">No products yet.</p>
              ) : (
                products.map((p) => (
                  <label key={p.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="productIds"
                      value={p.id}
                      defaultChecked={defaultValues.productIds.includes(p.id)}
                      className="h-4 w-4"
                    />
                    {p.name}
                  </label>
                ))
              )}
            </div>
          ) : null}
        </fieldset>
        <p className="mt-4 text-xs text-soft-black/50">
          {percentValid
            ? "Prices drop automatically only while the offer is live, and go back by themselves when it ends. Nothing is written into your products' saved prices."
            : "With no percentage this is messaging only: prices keep coming from each product's own Sale Price."}
        </p>
      </section>

      <button
        type="submit"
        className="w-fit bg-soft-black px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-warm-white transition-opacity hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}
