import { Room } from '@prisma/client';

const insertRoomStatus = (rooms: Room[]): Room[] => {
  const roomsWithStatus: Room[] = [];

  rooms.map((room) => {
    const status =
      room.detail || room.direction || room.directionPattern
        ? 'complete'
        : 'incomplete';

    roomsWithStatus.push({ ...room, status });
  });

  return roomsWithStatus;
};

export default insertRoomStatus;
