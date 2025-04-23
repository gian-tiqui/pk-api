-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_specializationId_fkey";

-- AlterTable
ALTER TABLE "Doctor" ALTER COLUMN "specializationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
