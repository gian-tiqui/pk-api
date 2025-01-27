-- AlterTable
CREATE SEQUENCE floor_id_seq;
ALTER TABLE "Floor" ALTER COLUMN "id" SET DEFAULT nextval('floor_id_seq');
ALTER SEQUENCE floor_id_seq OWNED BY "Floor"."id";

-- AlterTable
CREATE SEQUENCE log_id_seq;
ALTER TABLE "Log" ALTER COLUMN "id" SET DEFAULT nextval('log_id_seq');
ALTER SEQUENCE log_id_seq OWNED BY "Log"."id";

-- AlterTable
CREATE SEQUENCE room_id_seq;
ALTER TABLE "Room" ALTER COLUMN "id" SET DEFAULT nextval('room_id_seq');
ALTER SEQUENCE room_id_seq OWNED BY "Room"."id";

-- AlterTable
CREATE SEQUENCE roomimages_id_seq;
ALTER TABLE "RoomImages" ALTER COLUMN "id" SET DEFAULT nextval('roomimages_id_seq');
ALTER SEQUENCE roomimages_id_seq OWNED BY "RoomImages"."id";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";

-- CreateTable
CREATE TABLE "LogMethod" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LogMethod_method_key" ON "LogMethod"("method");

-- CreateIndex
CREATE UNIQUE INDEX "LogType_type_key" ON "LogType"("type");
