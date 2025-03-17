/*
  Warnings:

  - You are about to drop the column `directionPattern` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "directionPattern";

-- CreateTable
CREATE TABLE "DirectionPattern" (
    "id" SERIAL NOT NULL,
    "startingPoint" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "directionPattern" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectionPattern_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DirectionPattern" ADD CONSTRAINT "DirectionPattern_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
