-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "regionId" TEXT;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "regionId" TEXT;

-- AlterTable
ALTER TABLE "Startup" ADD COLUMN     "regionId" TEXT;

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionStats" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "startups" INTEGER NOT NULL DEFAULT 0,
    "employees" INTEGER NOT NULL DEFAULT 0,
    "openJobs" INTEGER NOT NULL DEFAULT 0,
    "upcomingEvents" INTEGER NOT NULL DEFAULT 0,
    "totalInvestment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegionStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionInitiative" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegionInitiative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EcosystemPartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EcosystemPartner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");

-- CreateIndex
CREATE INDEX "Region_slug_idx" ON "Region"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RegionStats_regionId_key" ON "RegionStats"("regionId");

-- CreateIndex
CREATE INDEX "RegionInitiative_regionId_idx" ON "RegionInitiative"("regionId");

-- CreateIndex
CREATE INDEX "Event_regionId_idx" ON "Event"("regionId");

-- CreateIndex
CREATE INDEX "News_regionId_idx" ON "News"("regionId");

-- CreateIndex
CREATE INDEX "Startup_regionId_idx" ON "Startup"("regionId");

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionStats" ADD CONSTRAINT "RegionStats_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionInitiative" ADD CONSTRAINT "RegionInitiative_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EcosystemPartner" ADD CONSTRAINT "EcosystemPartner_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;
