"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { signUp, logIn, type AccountFormState } from "@/lib/actions/account";

const inputClass =
  "w-full border border-warm-white/25 bg-transparent px-4 py-3 text-sm text-warm-white placeholder:text-warm-white/35 focus:border-electric-violet focus:outline-none";
const labelClass =
  "mb-1.5 block text-xs uppercase tracking-[0.1em] text-warm-white/50";

const initialState: AccountFormState = { status: "idle" };

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-[18px] w-[18px]">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function AccountAuthForms({
  googleEnabled = false,
  authError,
}: {
  googleEnabled?: boolean;
  authError?: string;
}) {
  const t = useTranslations("account");
  const pathname = usePathname();
  const googleHref = `/api/customer-auth/google/start?next=${encodeURIComponent(pathname)}`;
  const googleErrorKey =
    authError === "cancelled"
      ? "errorGoogleCancelled"
      : authError === "emailUnverified"
        ? "errorGoogleEmailUnverified"
        : authError === "unavailable"
          ? "errorGoogleUnavailable"
          : authError
            ? "errorGoogleFailed"
            : null;
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
      <h1 className="mt-4 text-3xl tracking-tight text-warm-white">
        {mode === "signIn" ? t("signInHeading") : t("signUpHeading")}
      </h1>
      <p className="mt-3 text-sm text-warm-white/55">
        {t("optionalNote")}
      </p>

      <div className="mt-8 flex gap-1">
        <button
          type="button"
          onClick={() => setMode("signIn")}
          className={`px-4 py-2.5 text-xs uppercase tracking-[0.1em] transition-colors ${
            mode === "signIn"
              ? "bg-warm-white/10 text-warm-white"
              : "text-warm-white/40 hover:text-warm-white/70"
          }`}
        >
          {t("signIn")}
        </button>
        <button
          type="button"
          onClick={() => setMode("signUp")}
          className={`px-4 py-2.5 text-xs uppercase tracking-[0.1em] transition-colors ${
            mode === "signUp"
              ? "bg-warm-white/10 text-warm-white"
              : "text-warm-white/40 hover:text-warm-white/70"
          }`}
        >
          {t("signUp")}
        </button>
      </div>

      {googleErrorKey ? (
        <p role="alert" className="mt-6 text-sm text-magenta">
          {t(googleErrorKey)}
        </p>
      ) : null}

      {googleEnabled ? (
        <>
          <a
            href={googleHref}
            className="mt-6 flex w-full items-center justify-center gap-3 border border-warm-white/40 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
          >
            <GoogleMark />
            {t("continueWithGoogle")}
          </a>
          <div className="mt-6 flex items-center gap-4 text-xs uppercase tracking-[0.15em] text-warm-white/35">
            <span className="h-px flex-1 bg-warm-white/10" />
            {t("orDivider")}
            <span className="h-px flex-1 bg-warm-white/10" />
          </div>
        </>
      ) : null}

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
