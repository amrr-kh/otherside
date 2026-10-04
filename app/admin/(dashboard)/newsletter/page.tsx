import { prisma } from "@/lib/db";
import { removeSubscriber } from "./actions";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-soft-black">Newsletter</h1>
          <p className="mt-1 text-sm text-soft-black/50">
            {subscribers.length} subscriber
            {subscribers.length === 1 ? "" : "s"} from the website sign-up form.
          </p>
        </div>
        {subscribers.length > 0 ? (
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page
          <a
            href="/admin/newsletter/export"
            className="shrink-0 rounded-md border border-soft-black/15 px-3 py-2 text-xs font-medium uppercase tracking-[0.1em] text-soft-black hover:bg-soft-black/5"
          >
            Download CSV
          </a>
        ) : null}
      </div>

      {subscribers.length === 0 ? (
        <p className="mt-8 text-sm text-soft-black/50">
          No one has signed up yet. New sign-ups from the home page appear here.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {subscribers.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-soft-black/10 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-soft-black">
                  {s.email}
                </p>
                <p className="text-xs text-soft-black/40">
                  {s.subscribedAt.toLocaleDateString("en-GB")}
                </p>
              </div>
              <form action={removeSubscriber.bind(null, s.id)}>
                <button
                  type="submit"
                  className="text-xs uppercase tracking-[0.1em] text-magenta hover:underline"
                >
                  Remove
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
