import type { CountdownParts } from "@/lib/promotion-shared";

export type CountdownLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  daysShort: string;
  hoursShort: string;
  minutesShort: string;
  secondsShort: string;
};

/**
 * The visual timer only. It is aria-hidden on purpose: a screen reader should
 * not announce a new number every second, so the fixed deadline sentence is
 * exposed separately.
 *
 * tabular-nums keeps every digit the same width so the row never jitters, and
 * "--" placeholders are the same width as real digits, so the first paint
 * (before the clock is aligned) causes no layout shift.
 */
export function CountdownDigits({
  parts,
  labels,
  className = "",
  digitClassName = "text-[13px] sm:text-[15px]",
}: {
  parts: CountdownParts | null;
  labels: CountdownLabels;
  className?: string;
  digitClassName?: string;
}) {
  const units = [
    { value: parts?.days ?? "--", long: labels.days, short: labels.daysShort },
    { value: parts?.hours ?? "--", long: labels.hours, short: labels.hoursShort },
    { value: parts?.minutes ?? "--", long: labels.minutes, short: labels.minutesShort },
    { value: parts?.seconds ?? "--", long: labels.seconds, short: labels.secondsShort },
  ];

  return (
    <p
      aria-hidden="true"
      dir="ltr"
      className={`flex items-baseline font-sans tabular-nums ${className}`}
    >
      {units.map((unit, index) => (
        <span key={unit.long} className="inline-flex items-baseline">
          {index > 0 ? (
            <span className="mx-1 text-copper/70 sm:mx-2">:</span>
          ) : null}
          <span
            className={`font-medium leading-none text-warm-white ${digitClassName}`}
          >
            {unit.value}
          </span>
          <span className="ms-0.5 text-[8px] uppercase leading-none tracking-[0.1em] text-copper-light sm:ms-1 sm:text-[9px] sm:tracking-[0.14em]">
            <span className="hidden sm:inline">{unit.long}</span>
            <span className="sm:hidden">{unit.short}</span>
          </span>
        </span>
      ))}
    </p>
  );
}
