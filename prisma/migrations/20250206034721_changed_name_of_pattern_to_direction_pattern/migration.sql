/*
  Warnings:

  - You are about to drop the column `pattern` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "pattern",
ADD COLUMN     "directionPattern" JSONB;
