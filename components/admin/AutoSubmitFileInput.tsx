"use client";

import type { InputHTMLAttributes } from "react";

/**
 * Submits its enclosing form the moment files are picked, so choosing a
 * photo IS the upload action — no separate button to miss on a page with
 * several other forms stacked below it.
 */
export function AutoSubmitFileInput(
  props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">,
) {
  return (
    <input
      {...props}
      type="file"
      onChange={(e) => {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
          e.currentTarget.form?.requestSubmit();
        }
      }}
    />
  );
}
