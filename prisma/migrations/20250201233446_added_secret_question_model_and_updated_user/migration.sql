/*
  Warnings:

  - You are about to drop the column `secretAnswer` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `secretQuestion` on the `User` table. All the data in the column will be lost.
  - Added the required column `secretQuestionId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "secretAnswer",
DROP COLUMN "secretQuestion",
ADD COLUMN     "secretQuestionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SecretQuestion" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecretQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_secretQuestionId_fkey" FOREIGN KEY ("secretQuestionId") REFERENCES "SecretQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
