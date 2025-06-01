/*
  Warnings:

  - Made the column `Public_Id` on table `Property` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "Public_Id" SET NOT NULL;
