"use client";

import { useActionState } from "react";
import {
  changePassword,
  type ChangePasswordState,
} from "@/app/admin/(dashboard)/settings/actions";

const inputClass =
  "w-full rounded border border-soft-black/15 bg-white px-3 py-2 text-sm text-soft-black focus:border-electric-violet focus:outline-none";

const initialState: ChangePasswordState = { status: "idle" };

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    initialState,
  );

  return (
    <form
      action={formAction}
      key={state.status === "success" ? "success" : "form"}
      className="mt-4 flex flex-col gap-4"
    >
      <div>
        <label className="mb-1 block text-xs text-soft-black/50">
          Current Password
        </label>
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-soft-black/50">
          New Password
        </label>
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-soft-black/50">
          Confirm New Password
        </label>
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={inputClass}
        />
      </div>

      {state.status === "error" ? (
        <p className="text-sm text-magenta">{state.message}</p>
      ) : null}
      {state.status === "success" ? (
        <p className="text-sm text-electric-violet">
          Password changed successfully.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit bg-soft-black px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-warm-white hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Change Password"}
      </button>
    </form>
  );
}
