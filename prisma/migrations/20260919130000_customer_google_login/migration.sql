-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "image" TEXT,
ALTER COLUMN "phone" DROP NOT NULL;
-- CreateTable
CREATE TABLE "CustomerOAuthAccount" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CustomerOAuthAccount_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "CustomerOAuthAccount_customerId_idx" ON "CustomerOAuthAccount"("customerId");
-- CreateIndex
CREATE UNIQUE INDEX "CustomerOAuthAccount_provider_providerAccountId_key" ON "CustomerOAuthAccount"("provider", "providerAccountId");
-- AddForeignKey
ALTER TABLE "CustomerOAuthAccount" ADD CONSTRAINT "CustomerOAuthAccount_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
