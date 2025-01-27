/*
  Warnings:

  - Added the required column `methodId` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Floor_code_key";

-- DropIndex
DROP INDEX "Floor_name_key";

-- DropIndex
DROP INDEX "Room_code_key";

-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "methodId" INTEGER NOT NULL,
ADD COLUMN     "typeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "LogType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "LogMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
