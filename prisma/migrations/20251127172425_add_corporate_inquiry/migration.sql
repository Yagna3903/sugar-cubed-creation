-- CreateEnum
CREATE TYPE "public"."InquiryStatus" AS ENUM ('new', 'contacted', 'completed');

-- CreateTable
CREATE TABLE "public"."CorporateInquiry" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "companyName" TEXT,
    "email" TEXT NOT NULL,
    "selectedProducts" JSONB NOT NULL,
    "message" TEXT,
    "status" "public"."InquiryStatus" NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorporateInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CorporateInquiry_status_idx" ON "public"."CorporateInquiry"("status");

-- CreateIndex
CREATE INDEX "CorporateInquiry_email_idx" ON "public"."CorporateInquiry"("email");
