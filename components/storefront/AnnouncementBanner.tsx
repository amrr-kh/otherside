import { Link } from "@/i18n/navigation";

export function AnnouncementBanner({
  text,
  linkUrl,
}: {
  text: string;
  linkUrl: string | null;
}) {
  const isExternal = linkUrl?.startsWith("http");
  const content = (
    <p className="mx-auto max-w-[1600px] px-5 py-2.5 text-center text-xs uppercase tracking-[0.1em] text-warm-white md:px-10">
      {text}
    </p>
  );

  return (
    <div className="bg-electric-violet">
      {linkUrl ? (
        isExternal ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block hover:opacity-90">
            {content}
          </a>
        ) : (
          <Link href={linkUrl} className="block hover:opacity-90">
            {content}
          </Link>
        )
      ) : (
        content
      )}
    </div>
  );
}
