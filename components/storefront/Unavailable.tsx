export function Unavailable({
  message = "Having trouble loading this right now — refresh in a moment.",
}: {
  message?: string;
}) {
  return <p className="text-sm text-warm-white/45">{message}</p>;
}
