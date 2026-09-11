import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { logEvent } from "@/lib/logger";

const RETRY_DELAYS_MS = [250, 750];

// Errors that mean the connection was never established — no bytes reached
// Postgres, so retrying is always safe regardless of read or write. The
// @prisma/adapter-pg driver surfaces the raw Node error code (e.g.
// "ETIMEDOUT") directly as .code instead of always wrapping it in a P1xxx
// Prisma code — observed directly against Neon's cold-start behavior, so
// both forms are checked, not just the classic P-codes.
const CONNECT_FAILURE_CODES = new Set(["P1001", "P1002", "ETIMEDOUT", "ECONNREFUSED"]);
const CONNECT_FAILURE_MESSAGE = /ETIMEDOUT|ECONNREFUSED/i;

// Errors that mean the connection dropped after being established — a query
// could have already reached the server. Retrying these is only safe for
// reads (no side effects to duplicate); a write that hits one of these must
// surface the error instead of being retried automatically here (see
// lib/actions/orders.ts's idempotency key for how writes recover safely).
const AMBIGUOUS_FAILURE_CODES = new Set(["P1017", "ECONNRESET"]);
const AMBIGUOUS_FAILURE_MESSAGE = /ECONNRESET|Connection terminated unexpectedly/i;

const READ_OPERATIONS = new Set([
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
]);

function errorCode(error: unknown): string | undefined {
  return (error as { code?: string } | undefined)?.code;
}

// Checked as a fallback alongside .code, since driver-adapter errors don't
// consistently put the useful detail in the same place (seen firsthand: a
// P2002 whose real constraint name only showed up in .message, not .meta).
function errorText(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const meta = (error as { meta?: unknown } | undefined)?.meta;
  return meta ? `${message} ${JSON.stringify(meta)}` : message;
}

function isConnectFailure(error: unknown): boolean {
  const code = errorCode(error);
  return (
    (!!code && CONNECT_FAILURE_CODES.has(code)) ||
    CONNECT_FAILURE_MESSAGE.test(errorText(error))
  );
}

function isAmbiguousFailure(error: unknown): boolean {
  const code = errorCode(error);
  return (
    (!!code && AMBIGUOUS_FAILURE_CODES.has(code)) ||
    AMBIGUOUS_FAILURE_MESSAGE.test(errorText(error))
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const client = new PrismaClient({ adapter });

  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, query, args }) {
          const isRead = READ_OPERATIONS.has(operation);

          for (let attempt = 0; ; attempt++) {
            try {
              return await query(args);
            } catch (error) {
              const retryable =
                isConnectFailure(error) || (isRead && isAmbiguousFailure(error));
              const exhausted = attempt >= RETRY_DELAYS_MS.length;

              logEvent("db_query_failed", {
                model,
                operation,
                attempt,
                retrying: retryable && !exhausted,
                connectFailure: isConnectFailure(error),
                errorCode: errorCode(error) ?? null,
                errorType: error instanceof Error ? error.constructor.name : typeof error,
              });

              if (exhausted || !retryable) throw error;
              await delay(RETRY_DELAYS_MS[attempt]);
            }
          }
        },
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
