-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_floorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "secretAnswer" TEXT,
ADD COLUMN     "secretQuestion" TEXT;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
