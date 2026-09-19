// The countdown reads this once per page load to line the visitor's clock up
// with the server's, so a phone with a wrong date/time still shows the same
// remaining time as every other device. It is never polled.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { now: Date.now() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
