-- DropForeignKey
ALTER TABLE "Startup" DROP CONSTRAINT "Startup_userId_fkey";

-- AlterTable
ALTER TABLE "Startup" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
