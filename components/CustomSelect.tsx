"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A native <select>'s dropdown popup is rendered by the OS/browser, not by
 * our CSS — on some devices it ignores color-scheme entirely and just uses
 * the system's own light/dark setting, which can make the option text
 * unreadable against our own theme regardless of what we author. This
 * renders the whole list with our own markup instead, so it always uses our
 * colors no matter what theme the visitor's device is set to.
 *
 * Do not add a native <select> anywhere in this codebase — use this
 * component instead, in either mode:
 *  - controlled: pass `value` + `onChange` (e.g. when the parent also needs
 *    the selection for other logic, like checkout's shipping calculation)
 *  - uncontrolled: pass `defaultValue` only (e.g. inside a Server Component
 *    form that just reads `name` back from FormData on submit)
 */
const THEME = {
  dark: {
    button:
      "border-warm-white/25 focus:border-electric-violet text-warm-white",
    placeholder: "text-warm-white/35",
    list: "border-warm-white/25 bg-cosmic-black shadow-lg",
    option: "text-warm-white/80 hover:bg-warm-white/10",
    optionSelected: "bg-warm-white/10 text-warm-white",
    chevron: "text-warm-white/40",
  },
  light: {
    button:
      "border-soft-black/15 focus:border-electric-violet bg-white text-soft-black",
    placeholder: "text-soft-black/40",
    list: "border-soft-black/15 bg-white shadow-lg",
    option: "text-soft-black/80 hover:bg-soft-black/5",
    optionSelected: "bg-soft-black/5 text-soft-black",
    chevron: "text-soft-black/40",
  },
} as const;

export type CustomSelectOption = string | { value: string; label: string };

function normalize(option: CustomSelectOption): { value: string; label: string } {
  return typeof option === "string" ? { value: option, label: option } : option;
}

export function CustomSelect({
  id,
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  options,
  placeholder,
  className = "",
  hasError = false,
  theme = "dark",
}: {
  id?: string;
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  theme?: "dark" | "light";
}) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const value = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = THEME[theme];
  const normalized = options.map(normalize);
  const selected = normalized.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectOption(optionValue: string) {
    if (!isControlled) setInternalValue(optionValue);
    onChange?.(optionValue);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 border bg-transparent px-4 py-3 text-start text-sm transition-colors focus:outline-none ${
          hasError ? "border-magenta" : t.button
        } ${className}`}
      >
        <span className={selected ? "" : t.placeholder}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${t.chevron} ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className={`absolute start-0 top-full z-20 mt-1 max-h-64 w-full overflow-y-auto border ${t.list}`}
        >
          {normalized.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                onClick={() => selectOption(option.value)}
                className={`block w-full px-4 py-2.5 text-start text-sm transition-colors ${
                  option.value === value ? t.optionSelected : t.option
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <input type="hidden" name={name} value={value} />
    </div>
  );
}
