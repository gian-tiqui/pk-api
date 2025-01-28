import { Injectable, Logger } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import errorHandler from 'src/utils/functions/errorHandler';
import * as path from 'path';
import { promises as fs, unlink, rename } from 'fs';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import extractUserId from 'src/utils/functions/extractUserId';
import notFound from 'src/utils/functions/notFound';
import { LogType, LogMethod, PaginationDefault } from 'src/utils/enums/enum';
import { Create, FindMany, FindOne } from 'src/utils/types/types';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { Room } from '@prisma/client';
import getPreviousValues from 'src/utils/functions/getPreviousValues';

@Injectable()
export class RoomService {
  private logger: Logger = new Logger('RoomService');

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createRoom(
    createRoomDto: CreateRoomDto,
    accessToken: string,
  ): Promise<Create> {
    try {
      const id = extractUserId(accessToken, this.jwtService);

      const [user, floor] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id } }),
        this.prismaService.floor.findFirst({
          where: { id: createRoomDto.floorId },
        }),
      ]);

      if (!user) notFound('User', id);
      if (!floor) notFound(`Floor`, createRoomDto.floorId);

      const newRoom = await this.prismaService.room.create({
        data: createRoomDto,
      });

      await this.prismaService.log.create({
        data: {
          userId: id,
          log: newRoom,
          typeId: LogType.ROOM,
          methodId: LogMethod.CREATE,
        },
      });

      return {
        message: 'Room created successfully',
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findRooms(query: FindAllDto): Promise<FindMany> {
    const { offset, limit, search, sortBy, sortOrder, isDeleted } = query;
    const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

    try {
      const where: object = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(isDeleted ? { isDeleted } : { isDeleted: false }),
      };

      const rooms: (Room & {
        images: { imageLocation: string; isMainImage: boolean }[];
      })[] = await this.prismaService.room.findMany({
        where,
        orderBy,
        include: {
          images: { select: { imageLocation: true, isMainImage: true } },
        },
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count: number = await this.prismaService.room.count({
        where,
      });

      return {
        message: 'Rooms loaded successfully.',
        count,
        rooms,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findRoomById(roomId: number): Promise<FindOne> {
    try {
      const room = await this.prismaService.room.findFirst({
        where: { id: roomId },
        include: {
          images: { select: { imageLocation: true, isMainImage: true } },
        },
      });

      if (!room) notFound(`Room`, roomId);

      return {
        message: `Room with the id ${roomId} loaded successfully`,
        room,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async updateRoomById(
    roomId: number,
    updateRoomDto: UpdateRoomDto,
    files: Express.Multer.File[],
    accessToken: string,
  ) {
    try {
      const room = await this.prismaService.room.findFirst({
        where: { id: roomId },
      });

      if (!room) notFound('Room', roomId);

      await this.prismaService.room.update({
        where: { id: roomId },
        data: updateRoomDto,
      });

      const userId = extractUserId(accessToken, this.jwtService);

      await this.prismaService.log.create({
        data: {
          userId,
          log: getPreviousValues(room, updateRoomDto),
          typeId: LogType.ROOM,
          methodId: LogMethod.UPDATE,
        },
      });

      return {
        message: `Room with the id ${roomId} updated successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async softRemoveRoomById(roomId: number, accessToken: string) {
    try {
      const room = await this.prismaService.room.findFirst({
        where: { id: roomId },
      });

      if (!room) notFound('Room', roomId);

      await this.prismaService.room.update({
        where: { id: roomId },
        data: { isDeleted: true },
      });

      const userId = extractUserId(accessToken, this.jwtService);

      await this.prismaService.log.create({
        data: {
          log: { isDeleted: false },
          userId,
          typeId: LogType.ROOM,
          methodId: LogMethod.SOFT_DELETE,
        },
      });

      return {
        message: `Room with the id ${roomId} moved to trash.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async deleteRoomById(roomId: number, accessToken: string) {
    try {
      const room = await this.prismaService.room.findFirst({
        where: { id: roomId, isDeleted: false },
      });

      if (!room) notFound('Room', roomId);

      await this.prismaService.room.delete({ where: { id: roomId } });

      const userId = extractUserId(accessToken, this.jwtService);

      await this.prismaService.log.create({
        data: {
          log: room,
          userId,
          typeId: LogType.ROOM,
          methodId: LogMethod.DELETE,
        },
      });

      return {
        message: `Room with the id ${roomId} deleted successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async retrieveRoomById(roomId: number, accessToken: string) {
    try {
      const room = await this.prismaService.room.findFirst({
        where: { id: roomId, isDeleted: true },
      });

      if (!room) notFound('Room', roomId);

      await this.prismaService.room.update({
        where: { id: roomId },
        data: {
          isDeleted: false,
        },
      });

      const userId = extractUserId(accessToken, this.jwtService);

      await this.prismaService.log.create({
        data: {
          log: { isDeleted: true },
          userId,
          methodId: LogMethod.RETRIEVE,
          typeId: LogType.ROOM,
        },
      });

      return {
        message: `Room with the id ${roomId} retrieved.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
