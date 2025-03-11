-- AlterTable
ALTER TABLE "ClimateImpact" ADD COLUMN     "carbonCapturedDescription" TEXT,
ADD COLUMN     "co2ReductionDescription" TEXT,
ADD COLUMN     "energyEfficiencyDescription" TEXT,
ADD COLUMN     "lifecycleCo2ReductionDescription" TEXT,
ADD COLUMN     "wasteDivertedDescription" TEXT,
ADD COLUMN     "waterSavedDescription" TEXT;

-- AlterTable
ALTER TABLE "Startup" ADD COLUMN     "fundingNeeds" TEXT,
ADD COLUMN     "investmentStage" TEXT,
ADD COLUMN     "startupStage" TEXT;

-- CreateIndex
CREATE INDEX "EcosystemPartner_regionId_idx" ON "EcosystemPartner"("regionId");
