-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "amount" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "date" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- CreateTable
CREATE TABLE "Billing" (
    "id" SERIAL NOT NULL,
    "addId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "reciverId" INTEGER NOT NULL,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);
