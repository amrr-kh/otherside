-- Add idempotency key to prevent duplicate orders from double-clicks,
-- browser retries, or a client-side retry after a dropped connection.
ALTER TABLE "Order" ADD COLUMN "idempotencyKey" TEXT;

-- Backfill existing rows with a unique placeholder so the column can become
-- NOT NULL + UNIQUE without touching real order data — there is no real
-- idempotency key for orders placed before this feature existed.
UPDATE "Order" SET "idempotencyKey" = 'legacy-' || "id" WHERE "idempotencyKey" IS NULL;

ALTER TABLE "Order" ALTER COLUMN "idempotencyKey" SET NOT NULL;
CREATE UNIQUE INDEX "Order_idempotencyKey_key" ON "Order"("idempotencyKey");

-- Guard against overselling: quantity must never go negative even if an
-- application-level stock check is ever bypassed, skipped, or buggy.
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_quantity_non_negative" CHECK ("quantity" >= 0);
