-- CreateTable
CREATE TABLE "like" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "addID" INTEGER NOT NULL,

    CONSTRAINT "like_pkey" PRIMARY KEY ("id")
);
