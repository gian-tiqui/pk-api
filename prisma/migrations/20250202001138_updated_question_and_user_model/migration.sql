/*
  Warnings:

  - You are about to drop the column `answer` on the `SecretQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SecretQuestion" DROP COLUMN "answer";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "secretAnswer" TEXT;
