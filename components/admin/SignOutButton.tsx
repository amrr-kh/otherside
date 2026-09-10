"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-xs uppercase tracking-[0.15em] text-soft-black/50 hover:text-soft-black"
    >
      Sign Out
    </button>
  );
}
