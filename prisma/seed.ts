import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db";

const DEFAULT_EMAIL = "owner@otherside.local";
const DEFAULT_PASSWORD = "otherside-admin";

async function main() {
  const usingDefaults =
    !process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD;

  const email = process.env.SEED_ADMIN_EMAIL || DEFAULT_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD || DEFAULT_PASSWORD;

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash },
    create: { email: email.toLowerCase(), passwordHash, role: "OWNER" },
  });

  console.log(`Seeded admin user: ${admin.email}`);
  if (usingDefaults) {
    console.log(
      `No SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD set — used the default login (${DEFAULT_EMAIL} / ${DEFAULT_PASSWORD}). Change it from Settings once that page exists, or re-run this seed with your own SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD in .env.`,
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
