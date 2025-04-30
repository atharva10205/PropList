/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "imageUrl",
ALTER COLUMN "pricePerMonth" SET DATA TYPE TEXT,
ALTER COLUMN "securityDeposit" SET DATA TYPE TEXT,
ALTER COLUMN "applicationFee" SET DATA TYPE TEXT,
ALTER COLUMN "beds" SET DATA TYPE TEXT,
ALTER COLUMN "baths" SET DATA TYPE TEXT,
ALTER COLUMN "squareFeet" SET DATA TYPE TEXT;
