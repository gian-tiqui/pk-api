import { Prisma, Room } from '@prisma/client';

const getRoomsWithIncompleteData = (rooms: Room[] & Prisma.RoomInclude) => {
  return rooms.filter((room) => {
    return room.detail === null;
  });
};

export default getRoomsWithIncompleteData;
