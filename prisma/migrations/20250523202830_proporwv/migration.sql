/*
  Warnings:

  - Added the required column `contact` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('UNDER_PROGRESS', 'ACCESS', 'DECLINED');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "contact" INTEGER NOT NULL;
