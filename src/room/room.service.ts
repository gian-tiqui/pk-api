import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import errorHandler from 'src/utils/functions/errorHandler';
import * as path from 'path';
import { promises as fs } from 'fs';
import { JwtService } from '@nestjs/jwt';
import extractUserId from 'src/utils/functions/extractUserId';
import notFound from 'src/utils/functions/notFound';
import {
  LogType,
  LogMethod,
  PaginationDefault,
  Directory,
} from 'src/utils/enums/enum';
import { Create, FindMany, FindOne } from 'src/utils/types/types';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { Prisma, Room } from '@prisma/client';
import getPreviousValues from 'src/utils/functions/getPreviousValues';
import dataExists from 'src/utils/functions/dataExist';
import generateUniqueSuffix from 'src/utils/functions/generateUniqueSuffix';
import convertImagesIdsToIntArray from 'src/utils/functions/convertImageIdsToArray';
import { AddDirectionDto } from './dto/add-direction.dto';

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

      const [user, floor, room] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id } }),
        this.prismaService.floor.findFirst({
          where: { id: createRoomDto.floorId },
        }),
        this.prismaService.room.findFirst({
          where: {
            name: { equals: createRoomDto.name, mode: 'insensitive' },
            code: { equals: createRoomDto.code, mode: 'insensitive' },
            isDeleted: false,
          },
        }),
      ]);

      if (!user) notFound('User', id);
      if (!floor) notFound(`Floor`, createRoomDto.floorId);
      if (room) dataExists('Room');

      const newRoom = await this.prismaService.room.create({
        data: { ...createRoomDto, creatorId: id, status: 'incomplete' },
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
    const {
      offset,
      limit,
      search,
      sortBy,
      sortOrder,
      isDeleted,
      roomImageDeleted,
    } = query;
    const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

    try {
      const where: Prisma.RoomWhereInput = {
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
          images: {
            where: { isDeleted: roomImageDeleted ? roomImageDeleted : false },
            select: { id: true, imageLocation: true, isMainImage: true },
          },
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

  async findRoomById(roomId: number, query: FindAllDto): Promise<FindOne> {
    const { roomImageDeleted } = query;
    try {
      const room = await this.prismaService.room.findFirst({
        where: { id: roomId },
        include: {
          floor: { select: { name: true } },
          images: {
            where: { isDeleted: roomImageDeleted ? roomImageDeleted : false },

            select: { id: true, imageLocation: true, isMainImage: true },
          },
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
    accessToken: string,
  ) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, room] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.room.findFirst({
          where: { id: roomId },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!room) notFound('Room', roomId);

      await this.prismaService.room.update({
        where: { id: roomId },
        data: updateRoomDto,
      });

      const updatedRoom = await this.prismaService.room.findFirst({
        where: { id: roomId },
        include: { images: true },
      });

      if (
        updatedRoom.direction &&
        room.detail &&
        room.directionPattern &&
        updatedRoom.images.length > 0
      ) {
        await this.prismaService.room.update({
          where: { id: roomId },
          data: { status: 'complete' },
        });
      }

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

  async getRoomImagesByRoomId(roomId: number, query: FindAllDto) {
    const { offset, limit, isDeleted } = query;

    try {
      const where: Prisma.RoomImagesWhereInput = {
        ...(isDeleted && { isDeleted: true }),
      };

      const images = await this.prismaService.roomImages.findMany({
        where,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
        select: { id: true, imageLocation: true },
      });

      const count = await this.prismaService.roomImages.count();

      return {
        message: `Images of the room with the id ${roomId} loaded successfully.`,
        images,
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async uploadRoomPhotosById(
    roomId: number,
    files: Express.Multer.File[],
    accessToken: string,
  ) {
    try {
      const id = extractUserId(accessToken, this.jwtService);

      const [user, room] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id } }),
        this.prismaService.room.findFirst({
          where: { id: roomId },
        }),
      ]);

      if (!user) notFound('User', id);
      if (!room) notFound('Room', roomId);
      if (!files || files.length < 1)
        throw new BadRequestException(`Upload must contain at least one image`);

      const dir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        Directory.UPLOAD,
        Directory.ROOM_IMAGES,
      );

      await fs.mkdir(dir, { recursive: true });

      const imageLocations: string[] = [];

      for (const [index, file] of files.entries()) {
        const fileName = generateUniqueSuffix(roomId, file.originalname);

        const filePath = path.join(dir, fileName);

        await fs.writeFile(filePath, file.buffer);

        await this.prismaService.roomImages.create({
          data: {
            imageLocation: fileName,
            isMainImage: index === 0,
            roomId,
          },
        });

        imageLocations.push(fileName);
      }

      await this.prismaService.log.create({
        data: {
          log: { imageLocations },
          userId: id,
          typeId: LogType.ROOM,
          methodId: LogMethod.UPDATE,
        },
      });

      return {
        message: `Images uploaded to the room with the id ${roomId} successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async setRoomDirectionPattern(
    roomId: number,
    addDirectionDto: AddDirectionDto,
    accessToken: string,
  ) {
    try {
      const id = extractUserId(accessToken, this.jwtService);

      const [user, room] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id } }),
        this.prismaService.room.findFirst({ where: { id: roomId } }),
      ]);

      if (!user) notFound(`User`, id);
      if (!room) notFound(`Room`, roomId);

      await this.prismaService.room.update({
        where: { id: roomId },
        data: {
          directionPattern: addDirectionDto.directions,
        },
      });

      await this.prismaService.log.create({
        data: {
          log: addDirectionDto.directions,
          userId: id,
          typeId: LogType.FLOOR,
          methodId: LogMethod.UPDATE,
        },
      });

      return {
        message: `The room with the id ${roomId}'s directions added successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async deleteSelectedRoomImages(
    roomId: number,
    selectedImageIds: string,
    accessToken: string,
  ) {
    try {
      if (!selectedImageIds || selectedImageIds == '')
        throw new BadRequestException(`Selected images ids are missing.`);

      const id = extractUserId(accessToken, this.jwtService);

      const [user, room] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id } }),
        this.prismaService.room.findFirst({ where: { id: roomId } }),
      ]);

      if (!user) notFound('User', id);
      if (!room) notFound('Room', roomId);

      const imageIds = convertImagesIdsToIntArray(selectedImageIds);

      await Promise.all(
        imageIds.map(async (id: number) => {
          const where: Prisma.RoomImagesWhereUniqueInput = { id, roomId };

          const roomImage = await this.prismaService.roomImages.findFirst({
            where,
          });

          if (!roomImage) {
            throw new NotFoundException(
              `Image not found in the room with the id ${roomId}`,
            );
          }

          return this.prismaService.roomImages.update({
            where,
            data: { isDeleted: true },
          });
        }),
      );

      await this.prismaService.log.create({
        data: {
          log: { deleteRoomIds: imageIds },
          methodId: LogMethod.SOFT_DELETE,
          typeId: LogType.ROOM_IMAGES,
          userId: id,
        },
      });

      return {
        message: `Room Images with the ids ${selectedImageIds} deleted of room with the id ${roomId}.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async softRemoveRoomById(roomId: number, accessToken: string) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, room] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.room.findFirst({
          where: { id: roomId },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!room) notFound('Room', roomId);

      await this.prismaService.room.update({
        where: { id: roomId },
        data: { isDeleted: true },
      });

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
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, room] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.room.findFirst({
          where: { id: roomId },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!room) notFound('Room', roomId);

      await this.prismaService.room.delete({ where: { id: roomId } });

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
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, room] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.room.findFirst({
          where: { id: roomId },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!room) notFound('Room', roomId);

      await this.prismaService.room.update({
        where: { id: roomId },
        data: {
          isDeleted: false,
        },
      });

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
