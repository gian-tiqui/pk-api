import { DirectionPattern, Room } from '@prisma/client';

const insertRoomStatus = (rooms: Room[]): Room[] => {
  const roomsWithStatus: Room[] = [];

  rooms.map((room: Room & { directionPatterns: DirectionPattern[] }) => {
    const status =
      room.detail &&
      room.direction &&
      room.directionPatterns &&
      room.directionPatterns.length > 0
        ? 'complete'
        : 'incomplete';

    roomsWithStatus.push({ ...room, status });
  });

  return roomsWithStatus;
};

export default insertRoomStatus;
