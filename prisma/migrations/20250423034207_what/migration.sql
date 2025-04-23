/*
  Warnings:

  - Added the required column `parentId` to the `Specialization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Specialization" ADD COLUMN     "parentId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Specialization" ADD CONSTRAINT "Specialization_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
