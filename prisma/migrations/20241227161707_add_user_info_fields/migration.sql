/*
  Warnings:

  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "userName";

-- CreateTable
CREATE TABLE "Kupci" (
    "id" SERIAL NOT NULL,
    "pol" TEXT NOT NULL,
    "starosnaGrupa" TEXT NOT NULL,
    "Grad" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kupci_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Kupci" ADD CONSTRAINT "Kupci_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
