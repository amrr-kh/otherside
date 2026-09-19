"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { CustomSelect } from "@/components/CustomSelect";
import {
  saveAddress,
  deleteAddress,
  type AddressFormState,
} from "@/lib/actions/account";

export type SavedAddress = {
  id: string;
  governorate: string;
  city: string;
  street: string;
  building: string;
  floor: string | null;
  apartment: string | null;
  landmark: string | null;
};

const inputClass =
  "w-full border border-warm-white/25 bg-transparent px-4 py-3 text-sm text-warm-white placeholder:text-warm-white/35 focus:border-electric-violet focus:outline-none";
const labelClass =
  "mb-1.5 block text-xs uppercase tracking-[0.1em] text-warm-white/50";
const smallButton =
  "border border-warm-white/40 px-4 py-2 text-xs uppercase tracking-[0.1em] text-warm-white/80 transition-colors hover:border-warm-white hover:text-warm-white disabled:opacity-40";

const initialState: AddressFormState = { status: "idle" };

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function AddressForm({
  address,
  governorates,
  onDone,
}: {
  address?: SavedAddress;
  governorates: string[];
  onDone: () => void;
}) {
  const t = useTranslations("account");
  const tc = useTranslations("checkout");
  const [state, formAction, isPending] = useActionState(saveAddress, initialState);

  useEffect(() => {
    if (state.status === "saved") onDone();
  }, [state, onDone]);

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-4 border border-warm-white/15 p-5 sm:grid-cols-2"
    >
      {address ? <input type="hidden" name="id" value={address.id} /> : null}
      <div>
        <label className={labelClass} htmlFor={`gov-${address?.id ?? "new"}`}>
          {tc("governorate")}
        </label>
        <CustomSelect
          id={`gov-${address?.id ?? "new"}`}
          name="governorate"
          defaultValue={address?.governorate ?? ""}
          options={governorates}
          placeholder={tc("governoratePlaceholder")}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor={`city-${address?.id ?? "new"}`}>
          {tc("city")}
        </label>
        <input
          id={`city-${address?.id ?? "new"}`}
          name="city"
          required
          defaultValue={address?.city}
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor={`street-${address?.id ?? "new"}`}>
          {tc("street")}
        </label>
        <input
          id={`street-${address?.id ?? "new"}`}
          name="street"
          required
          defaultValue={address?.street}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor={`building-${address?.id ?? "new"}`}>
          {tc("building")}
        </label>
        <input
          id={`building-${address?.id ?? "new"}`}
          name="building"
          required
          defaultValue={address?.building}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor={`floor-${address?.id ?? "new"}`}>
          {tc("floor")}
        </label>
        <input
          id={`floor-${address?.id ?? "new"}`}
          name="floor"
          defaultValue={address?.floor ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor={`apt-${address?.id ?? "new"}`}>
          {tc("apartment")}
        </label>
        <input
          id={`apt-${address?.id ?? "new"}`}
          name="apartment"
          defaultValue={address?.apartment ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor={`landmark-${address?.id ?? "new"}`}>
          {tc("landmark")}
        </label>
        <input
          id={`landmark-${address?.id ?? "new"}`}
          name="landmark"
          defaultValue={address?.landmark ?? ""}
          className={inputClass}
        />
      </div>

      {state.status === "error" ? (
        <p role="alert" className="text-sm text-magenta sm:col-span-2">
          {t(`errorAddress${capitalize(state.message)}`)}
        </p>
      ) : null}

      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-warm-white px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? t("savingAddress") : t("saveAddressButton")}
        </button>
        <button type="button" onClick={onDone} className={smallButton}>
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}

export function AddressBook({
  addresses,
  governorates,
}: {
  addresses: SavedAddress[];
  governorates: string[];
}) {
  const t = useTranslations("account");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const closeForm = () => setEditing(null);

  return (
    <div className="mt-4 flex flex-col gap-4">
      {addresses.length === 0 && editing !== "new" ? (
        <p className="text-sm text-warm-white/45">{t("noAddresses")}</p>
      ) : null}

      {addresses.map((address) =>
        editing === address.id ? (
          <AddressForm
            key={address.id}
            address={address}
            governorates={governorates}
            onDone={closeForm}
          />
        ) : (
          <div
            key={address.id}
            className="flex flex-wrap items-start justify-between gap-4 border border-warm-white/10 p-4"
          >
            <p className="text-sm leading-relaxed text-warm-white/70">
              {address.street}, {address.building}
              {address.floor ? `, ${address.floor}` : ""}
              {address.apartment ? `, ${address.apartment}` : ""}
              <br />
              {address.city}, {address.governorate}
              {address.landmark ? (
                <>
                  <br />
                  <span className="text-warm-white/45">{address.landmark}</span>
                </>
              ) : null}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmingDelete(null);
                  setEditing(address.id);
                }}
                className={smallButton}
              >
                {t("editAddress")}
              </button>
              {confirmingDelete === address.id ? (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() =>
                    startDelete(async () => {
                      await deleteAddress(address.id);
                      setConfirmingDelete(null);
                    })
                  }
                  className="border border-magenta px-4 py-2 text-xs uppercase tracking-[0.1em] text-warm-white hover:bg-magenta disabled:opacity-40"
                >
                  {t("confirmDelete")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(address.id)}
                  className={smallButton}
                >
                  {t("deleteAddress")}
                </button>
              )}
            </div>
          </div>
        ),
      )}

      {editing === "new" ? (
        <AddressForm governorates={governorates} onDone={closeForm} />
      ) : (
        <button
          type="button"
          onClick={() => {
            setConfirmingDelete(null);
            setEditing("new");
          }}
          className={`${smallButton} self-start`}
        >
          {t("addAddress")}
        </button>
      )}
    </div>
  );
}
