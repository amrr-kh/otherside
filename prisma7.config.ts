import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  // The CLI (migrate, db push, studio) always connects directly, bypassing
  // Neon's pooler — pgbouncer's transaction-pooling mode doesn't reliably
  // support the session-level locks migrations need. The running app never
  // uses this; it stays on the pooled DATABASE_URL via lib/db/index.ts.
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
