"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { signUp, logIn, type AccountFormState } from "@/lib/actions/account";

const inputClass =
  "w-full border border-warm-white/25 bg-transparent px-4 py-3 text-sm text-warm-white placeholder:text-warm-white/35 focus:border-electric-violet focus:outline-none";
const labelClass =
  "mb-1.5 block text-xs uppercase tracking-[0.1em] text-warm-white/50";

const initialState: AccountFormState = { status: "idle" };

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function AccountAuthForms() {
  const t = useTranslations("account");
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [signInState, signInAction, signInPending] = useActionState(
    logIn,
    initialState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    initialState,
  );

  return (
    <div className="mx-auto max-w-md px-5 py-24 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-display text-4xl italic text-warm-white">
        {mode === "signIn" ? t("signInHeading") : t("signUpHeading")}
      </h1>
      <p className="mt-3 text-sm text-warm-white/55">
        {t("optionalNote")}
      </p>

      <div className="mt-8 flex border-b border-warm-white/10">
        <button
          type="button"
          onClick={() => setMode("signIn")}
          className={`px-4 py-2.5 text-xs font-medium uppercase tracking-[0.1em] ${
            mode === "signIn"
              ? "border-b-2 border-warm-white text-warm-white"
              : "text-warm-white/40 hover:text-warm-white/70"
          }`}
        >
          {t("signIn")}
        </button>
        <button
          type="button"
          onClick={() => setMode("signUp")}
          className={`px-4 py-2.5 text-xs font-medium uppercase tracking-[0.1em] ${
            mode === "signUp"
              ? "border-b-2 border-warm-white text-warm-white"
              : "text-warm-white/40 hover:text-warm-white/70"
          }`}
        >
          {t("signUp")}
        </button>
      </div>

      {mode === "signIn" ? (
        <form action={signInAction} className="mt-6 flex flex-col gap-4">
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
            <label className={labelClass} htmlFor="password">
              {t("password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={inputClass}
            />
          </div>
          {signInState.status === "error" ? (
            <p className="text-sm text-magenta">
              {t(`error${capitalize(signInState.message)}`)}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={signInPending}
            className="mt-2 w-full bg-warm-white px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {signInPending ? t("signingIn") : t("signIn")}
          </button>
        </form>
      ) : (
        <form action={signUpAction} className="mt-6 flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="name">
              {t("name")}
            </label>
            <input id="name" name="name" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="signUpPhone">
              {t("phone")}
            </label>
            <input
              id="signUpPhone"
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
          <div>
            <label className={labelClass} htmlFor="signUpPassword">
              {t("password")}
            </label>
            <input
              id="signUpPassword"
              name="password"
              type="password"
              required
              minLength={8}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="confirmPassword">
              {t("confirmPassword")}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className={inputClass}
            />
          </div>
          {signUpState.status === "error" ? (
            <p className="text-sm text-magenta">
              {t(`error${capitalize(signUpState.message)}`)}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={signUpPending}
            className="mt-2 w-full bg-warm-white px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {signUpPending ? t("signingUp") : t("signUp")}
          </button>
        </form>
      )}
    </div>
  );
}
