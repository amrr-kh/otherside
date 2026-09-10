"use client";

import { useMemo, useState, useActionState, useTransition } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { placeOrder, type PlaceOrderState } from "@/lib/actions/orders";
import { checkPromoCode } from "@/lib/actions/promo";
import type { CartLine } from "@/lib/storefront/cart";
import type { ShippingZoneOption } from "@/lib/storefront/shipping";

const inputClass =
  "w-full border border-warm-white/25 bg-transparent px-4 py-3 text-sm text-warm-white placeholder:text-warm-white/35 focus:border-electric-violet focus:outline-none";
const labelClass =
  "mb-1.5 block text-xs uppercase tracking-[0.1em] text-warm-white/50";

const initialState: PlaceOrderState = { status: "idle" };

export function CheckoutForm({
  items,
  subtotal,
  zones,
}: {
  items: CartLine[];
  subtotal: number;
  zones: ShippingZoneOption[];
}) {
  const t = useTranslations("checkout");
  const [state, formAction, isPending] = useActionState(
    placeOrder,
    initialState,
  );
  const [governorate, setGovernorate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "INSTAPAY" | "MOBILE_WALLET"
  >("COD");

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCheckingPromo, startPromoCheck] = useTransition();

  const governorateOptions = useMemo(
    () =>
      zones
        .flatMap((z) => z.governorates)
        .sort((a, b) => a.localeCompare(b)),
    [zones],
  );

  const matchedZone = zones.find((z) => z.governorates.includes(governorate));
  const shippingCost = matchedZone
    ? matchedZone.freeShippingThreshold !== null &&
      subtotal >= matchedZone.freeShippingThreshold
      ? 0
      : matchedZone.price
    : null;
  const discountAmount = appliedPromo?.discountAmount ?? 0;
  const total = subtotal + (shippingCost ?? 0) - discountAmount;

  function handleApplyPromo() {
    const code = promoInput.trim();
    if (!code) return;
    setPromoError(null);
    startPromoCheck(async () => {
      const result = await checkPromoCode(code, subtotal);
      if (result.valid) {
        setAppliedPromo({ code: result.code, discountAmount: result.discountAmount });
        setPromoError(null);
      } else {
        setAppliedPromo(null);
        setPromoError(result.message);
      }
    });
  }

  function handleRemovePromo() {
    setAppliedPromo(null);
    setPromoError(null);
    setPromoInput("");
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr]">
      <div>
        <h1 className="font-display text-3xl italic text-warm-white md:text-4xl">
          {t("heading")}
        </h1>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-warm-white">
            {t("contactHeading")}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="name">
                {t("fullName")}
              </label>
              <input id="name" name="name" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="phone">
                {t("phone")}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                dir="ltr"
                placeholder="01xxxxxxxxx"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="email">
                {t("email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                dir="ltr"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-warm-white">
            {t("addressHeading")}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="governorate">
                {t("governorate")}
              </label>
              <select
                id="governorate"
                name="governorate"
                required
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  {t("governoratePlaceholder")}
                </option>
                {governorateOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="city">
                {t("city")}
              </label>
              <input id="city" name="city" required className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="street">
                {t("street")}
              </label>
              <input id="street" name="street" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="building">
                {t("building")}
              </label>
              <input
                id="building"
                name="building"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="floor">
                {t("floor")}
              </label>
              <input id="floor" name="floor" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="apartment">
                {t("apartment")}
              </label>
              <input id="apartment" name="apartment" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="landmark">
                {t("landmark")}
              </label>
              <input id="landmark" name="landmark" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="notes">
                {t("notes")}
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-warm-white">
            {t("paymentHeading")}
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {(
              [
                ["COD", t("paymentCod")],
                ["INSTAPAY", t("paymentInstapay")],
                ["MOBILE_WALLET", t("paymentWallet")],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors ${
                  paymentMethod === value
                    ? "border-warm-white text-warm-white"
                    : "border-warm-white/20 text-warm-white/60 hover:border-warm-white/40"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                  className="accent-electric-violet"
                />
                {label}
              </label>
            ))}
          </div>
          {paymentMethod !== "COD" ? (
            <p className="mt-3 text-xs text-warm-white/45">
              {t("manualPaymentNote")}
            </p>
          ) : null}
        </section>

        {state.status === "error" ? (
          <p className="mt-6 text-sm text-magenta">
            {t(`error${capitalize(state.message)}`)}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="mt-8 w-full bg-warm-white px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-90 disabled:opacity-50 md:hidden"
        >
          {isPending ? t("placingOrder") : t("placeOrder")}
        </button>
      </div>

      {/* Order summary */}
      <div className="h-fit border border-warm-white/10 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-warm-white">
          {t("orderSummary")}
        </h2>

        <div className="mt-5 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-soft-black">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-warm-white">{item.productName}</p>
                  <p className="mt-0.5 text-xs text-warm-white/45">
                    {item.color} / {item.size} × {item.quantity}
                  </p>
                </div>
                <span className="whitespace-nowrap text-xs text-gold">
                  EGP {(item.unitPrice * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-warm-white/10 pt-4">
          {appliedPromo ? (
            <div className="flex items-center justify-between gap-2 border border-electric-violet/40 bg-electric-violet/10 px-3 py-2 text-xs text-warm-white">
              <span dir="ltr">{appliedPromo.code}</span>
              <button
                type="button"
                onClick={handleRemovePromo}
                className="uppercase tracking-[0.08em] text-warm-white/60 hover:text-warm-white"
              >
                {t("removePromo")}
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder={t("promoPlaceholder")}
                dir="ltr"
                className="w-full border border-warm-white/25 bg-transparent px-3 py-2.5 text-xs text-warm-white placeholder:text-warm-white/35 focus:border-electric-violet focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isCheckingPromo || !promoInput.trim()}
                className="shrink-0 border border-warm-white/40 px-4 text-xs uppercase tracking-[0.08em] text-warm-white hover:border-warm-white disabled:opacity-40"
              >
                {isCheckingPromo ? t("applyingPromo") : t("applyPromo")}
              </button>
            </div>
          )}
          {promoError ? (
            <p className="mt-2 text-xs text-magenta">
              {t(`promoError${capitalize(promoError)}`)}
            </p>
          ) : null}
        </div>

        <input type="hidden" name="promoCode" value={appliedPromo?.code ?? ""} />

        <div className="mt-4 space-y-2 border-t border-warm-white/10 pt-4 text-sm">
          <div className="flex justify-between gap-3 text-warm-white/60">
            <span>{t("subtotal")}</span>
            <span className="text-end">EGP {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-3 text-warm-white/60">
            <span className="shrink-0">{t("shipping")}</span>
            <span className="text-end">
              {shippingCost === null
                ? t("selectGovernorateForShipping")
                : `EGP ${shippingCost.toLocaleString()}`}
            </span>
          </div>
          {discountAmount > 0 ? (
            <div className="flex justify-between gap-3 text-electric-violet">
              <span>{t("discount")}</span>
              <span className="text-end">-EGP {discountAmount.toLocaleString()}</span>
            </div>
          ) : null}
          <div className="flex justify-between gap-3 border-t border-warm-white/10 pt-2 text-base text-warm-white">
            <span>{t("total")}</span>
            <span className="text-end text-gold">EGP {total.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 hidden w-full bg-warm-white px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-90 disabled:opacity-50 md:block"
        >
          {isPending ? t("placingOrder") : t("placeOrder")}
        </button>
      </div>
    </form>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
