import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm text-soft-black/50">
        That admin page doesn&apos;t exist.
      </p>
      <Link
        href="/admin"
        className="text-sm font-medium text-electric-violet hover:underline"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
