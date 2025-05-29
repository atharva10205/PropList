-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'under_process';

-- DropEnum
DROP TYPE "ApplicationStatus";
