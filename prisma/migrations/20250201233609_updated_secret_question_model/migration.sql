-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_secretQuestionId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "secretQuestionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_secretQuestionId_fkey" FOREIGN KEY ("secretQuestionId") REFERENCES "SecretQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
