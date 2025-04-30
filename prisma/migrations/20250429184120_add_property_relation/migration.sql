-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pricePerMonth" INTEGER NOT NULL,
    "securityDeposit" INTEGER NOT NULL,
    "applicationFee" INTEGER NOT NULL,
    "beds" INTEGER NOT NULL,
    "baths" INTEGER NOT NULL,
    "squareFeet" INTEGER NOT NULL,
    "petsAllowed" BOOLEAN NOT NULL,
    "parkingIncluded" BOOLEAN NOT NULL,
    "propertyType" TEXT NOT NULL,
    "amenities" TEXT NOT NULL,
    "highlights" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "imageUrl" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
