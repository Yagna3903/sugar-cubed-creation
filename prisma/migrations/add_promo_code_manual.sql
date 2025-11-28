-- Add promo code fields with defaults for existing records
ALTER TABLE "Offer" ADD COLUMN "promoCode" TEXT;
ALTER TABLE "Offer" ADD COLUMN "discountType" TEXT NOT NULL DEFAULT 'percentage';
ALTER TABLE "Offer" ADD COLUMN "discountValue" INTEGER NOT NULL DEFAULT 15;
ALTER TABLE "Offer" ADD COLUMN "minPurchase" INTEGER;
ALTER TABLE "Offer" ADD COLUMN "minQuantity" INTEGER;
ALTER TABLE "Offer" ADD COLUMN "usageCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Offer" ADD COLUMN "maxUsage" INTEGER;

-- Create unique index on promoCode
CREATE UNIQUE INDEX "Offer_promoCode_key" ON "Offer"("promoCode");

-- Create index on promoCode for faster lookups
CREATE INDEX "Offer_promoCode_idx" ON "Offer"("promoCode");
