/*
  Warnings:

  - You are about to drop the column `codPaid` on the `Order` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentMethod" ADD VALUE 'INSTAPAY';
ALTER TYPE "PaymentMethod" ADD VALUE 'MOBILE_WALLET';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "codPaid",
ADD COLUMN     "paymentConfirmed" BOOLEAN NOT NULL DEFAULT false;
