-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "tiktokUrl" TEXT,
    "whatsappNumber" TEXT,
    "contactEmail" TEXT,
    "bannerEnabled" BOOLEAN NOT NULL DEFAULT false,
    "bannerText" TEXT,
    "bannerLinkUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
