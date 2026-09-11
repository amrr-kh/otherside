"use client";

// Never render error.message here — even in the admin, a database/Prisma
// failure can carry connection details or SQL in its message, and Next only
// strips that automatically in production, not in dev. error.digest is a
// safe correlation id to show instead.
export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-xs uppercase tracking-[0.1em] text-magenta">
        Something went wrong
      </p>
      <p className="max-w-md text-sm text-soft-black/60">
        We couldn&apos;t load this page. Please try again in a moment.
      </p>
      {error.digest ? (
        <p className="text-xs text-soft-black/35" dir="ltr">
          {error.digest}
        </p>
      ) : null}
      <button
        onClick={reset}
        className="rounded border border-soft-black/20 px-5 py-2.5 text-xs uppercase tracking-[0.08em] text-soft-black/70 hover:bg-soft-black/5"
      >
        Try Again
      </button>
    </div>
  );
}
