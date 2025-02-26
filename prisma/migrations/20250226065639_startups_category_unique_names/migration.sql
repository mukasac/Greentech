/*
  Warnings:

  - You are about to drop the column `mainCategory` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `subcategories` on the `Startup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Startup" DROP COLUMN "mainCategory",
DROP COLUMN "subcategories";
