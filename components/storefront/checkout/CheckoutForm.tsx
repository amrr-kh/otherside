"use client";

import { useMemo, useState, useActionState, useTransition } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { placeOrder, type PlaceOrderState } from "@/lib/actions/orders";
import { checkPromoCode } from "@/lib/actions/promo";
import { CustomSelect } from "@/components/CustomSelect";
import { PriceDisplay } from "@/components/storefront/PriceDisplay";
import type { CartLine } from "@/lib/storefront/cart";
import type { ShippingZoneOption } from "@/lib/storefront/shipping";
import type { SavedAddress } from "@/components/storefront/account/AddressBook";

const inputClass =
  "w-full border border-warm-white/25 bg-transparent px-4 py-3 text-sm text-warm-white placeholder:text-warm-white/35 focus:border-electric-violet focus:outline-none";
const labelClass =
  "mb-1.5 block text-xs uppercase tracking-[0.1em] text-warm-white/50";

const initialState: PlaceOrderState = { status: "idle" };

export function CheckoutForm({
  items,
  subtotal,
  zones,
  prefill,
  savedAddresses,
}: {
  items: CartLine[];
  subtotal: number;
  zones: ShippingZoneOption[];
  prefill?: { name: string; phone: string; email: string };
  /** Present (possibly empty) only for signed-in customers. */
  savedAddresses?: SavedAddress[];
}) {
  const t = useTranslations("checkout");
  const [state, formAction, isPending] = useActionState(
    placeOrder,
    initialState,
  );
  // One value for the whole lifetime of this form instance, so a
  // double-click, a slow-network retry, or the browser resubmitting the
  // same POST all carry the same key — the server treats a repeat of it as
  // "already placed" instead of creating a second order.
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const firstSaved = savedAddresses?.[0];
  const [governorate, setGovernorate] = useState(firstSaved?.governorate ?? "");
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    firstSaved?.id ?? "new",
  );
  const [addr, setAddr] = useState({
    city: firstSaved?.city ?? "",
    street: firstSaved?.street ?? "",
    building: firstSaved?.building ?? "",
    floor: firstSaved?.floor ?? "",
    apartment: firstSaved?.apartment ?? "",
    landmark: firstSaved?.landmark ?? "",
  });
  const [saveAddress, setSaveAddress] = useState(true);
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

  const canSaveAddress = savedAddresses !== undefined;
  const matchesSaved = (savedAddresses ?? []).some(
    (a) =>
      a.governorate === governorate &&
      a.city === addr.city.trim() &&
      a.street === addr.street.trim() &&
      a.building === addr.building.trim() &&
      (a.floor ?? "") === addr.floor.trim() &&
      (a.apartment ?? "") === addr.apartment.trim() &&
      (a.landmark ?? "") === addr.landmark.trim(),
  );

  function chooseAddress(id: string) {
    setSelectedAddressId(id);
    const chosen = savedAddresses?.find((a) => a.id === id);
    if (chosen) {
      setGovernorate(chosen.governorate);
      setAddr({
        city: chosen.city,
        street: chosen.street,
        building: chosen.building,
        floor: chosen.floor ?? "",
        apartment: chosen.apartment ?? "",
        landmark: chosen.landmark ?? "",
      });
    } else {
      setGovernorate("");
      setAddr({ city: "", street: "", building: "", floor: "", apartment: "", landmark: "" });
    }
  }

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
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <div>
        <h1 className="text-3xl tracking-tight text-warm-white md:text-3xl">
          {t("heading")}
        </h1>

        <section className="mt-8">
          <h2 className="text-sm uppercase tracking-[0.1em] text-warm-white">
            {t("contactHeading")}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="name">
                {t("fullName")}
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue={prefill?.name}
                className={inputClass}
              />
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
                defaultValue={prefill?.phone}
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
                defaultValue={prefill?.email}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm uppercase tracking-[0.1em] text-warm-white">
            {t("addressHeading")}
          </h2>

          {savedAddresses && savedAddresses.length > 0 ? (
            <fieldset className="mt-4">
              <legend className={labelClass}>{t("savedAddressesHeading")}</legend>
              <div className="flex flex-col gap-2">
                {savedAddresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer items-start gap-3 border px-4 py-3 text-sm transition-colors ${
                      selectedAddressId === a.id
                        ? "border-warm-white text-warm-white"
                        : "border-warm-white/20 text-warm-white/60 hover:border-warm-white/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === a.id}
                      onChange={() => chooseAddress(a.id)}
                      className="mt-1 accent-electric-violet"
                    />
                    <span className="leading-relaxed">
                      {a.street}, {a.building}
                      {a.floor ? `, ${a.floor}` : ""}
                      {a.apartment ? `, ${a.apartment}` : ""}
                      <br />
                      <span className="text-warm-white/45">
                        {a.city}, {a.governorate}
                      </span>
                    </span>
                  </label>
                ))}
                <label
                  className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors ${
                    selectedAddressId === "new"
                      ? "border-warm-white text-warm-white"
                      : "border-warm-white/20 text-warm-white/60 hover:border-warm-white/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    checked={selectedAddressId === "new"}
                    onChange={() => chooseAddress("new")}
                    className="accent-electric-violet"
                  />
                  {t("useNewAddress")}
                </label>
              </div>
            </fieldset>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="governorate">
                {t("governorate")}
              </label>
              <CustomSelect
                id="governorate"
                name="governorate"
                value={governorate}
                onChange={setGovernorate}
                options={governorateOptions}
                placeholder={t("governoratePlaceholder")}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="city">
                {t("city")}
              </label>
              <input
                id="city"
                name="city"
                required
                value={addr.city}
                onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="street">
                {t("street")}
              </label>
              <input
                id="street"
                name="street"
                required
                value={addr.street}
                onChange={(e) => setAddr({ ...addr, street: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="building">
                {t("building")}
              </label>
              <input
                id="building"
                name="building"
                required
                value={addr.building}
                onChange={(e) => setAddr({ ...addr, building: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="floor">
                {t("floor")}
              </label>
              <input
                id="floor"
                name="floor"
                value={addr.floor}
                onChange={(e) => setAddr({ ...addr, floor: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="apartment">
                {t("apartment")}
              </label>
              <input
                id="apartment"
                name="apartment"
                value={addr.apartment}
                onChange={(e) => setAddr({ ...addr, apartment: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="landmark">
                {t("landmark")}
              </label>
              <input
                id="landmark"
                name="landmark"
                value={addr.landmark}
                onChange={(e) => setAddr({ ...addr, landmark: e.target.value })}
                className={inputClass}
              />
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
            {canSaveAddress && !matchesSaved ? (
              <label className="flex cursor-pointer items-center gap-3 text-sm text-warm-white/70 sm:col-span-2">
                <input
                  type="checkbox"
                  name="saveAddress"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="accent-electric-violet"
                />
                {t("saveAddressForNext")}
              </label>
            ) : null}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm uppercase tracking-[0.1em] text-warm-white">
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
        <h2 className="text-sm uppercase tracking-[0.1em] text-warm-white">
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
                <PriceDisplay
                  price={item.unitPrice * item.quantity}
                  compareAtPrice={
                    item.compareAtUnitPrice === null
                      ? null
                      : item.compareAtUnitPrice * item.quantity
                  }
                  variant="line"
                />
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
