import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import { promises as fs } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  Directory,
  LogMethod,
  LogType,
  PaginationDefault,
} from 'src/utils/enums/enum';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import extractUserId from 'src/utils/functions/extractUserId';
import getPreviousValues from 'src/utils/functions/getPreviousValues';
import notFound from 'src/utils/functions/notFound';
import { Floor, Prisma } from '@prisma/client';
import dataExists from 'src/utils/functions/dataExist';
import {
  Create,
  FindMany,
  FindOne,
  RemoveById,
  RetrieveById,
  UpdateById,
} from 'src/utils/types/types';
import convertDatesToString from 'src/utils/functions/convertDatesToString';
import * as path from 'path';
import generateUniqueSuffix from 'src/utils/functions/generateUniqueSuffix';

@Injectable()
export class FloorService {
  private logger: Logger = new Logger('FloorService');

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createFloor(
    createFloorDto: CreateFloorDto,
    accessToken: string,
  ): Promise<Create> {
    try {
      const userId: number = extractUserId(accessToken, this.jwtService);

      const [user, floor] = await Promise.all([
        this.prismaService.user.findFirst({
          where: { id: userId },
        }),
        this.prismaService.floor.findFirst({
          where: {
            name: { equals: createFloorDto.name, mode: 'insensitive' },
            code: { equals: createFloorDto.code, mode: 'insensitive' },
            level: createFloorDto.level,
            isDeleted: false,
          },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (floor) dataExists(`Floor`);

      const newFloor = await this.prismaService.floor.create({
        data: { ...createFloorDto, creatorId: userId },
      });

      await this.prismaService.log.create({
        data: {
          userId,
          log: newFloor,
          typeId: LogType.FLOOR,
          methodId: LogMethod.CREATE,
        },
      });

      return {
        message: 'Floor created successfully',
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findFloors(query: FindAllDto): Promise<FindMany> {
    const { offset, limit, search, level, sortBy, sortOrder, isDeleted } =
      query;
    const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

    try {
      const where: Prisma.FloorWhereInput = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(level && { level }),
        ...(isDeleted ? { isDeleted } : { isDeleted: false }),
      };

      const floors: Floor[] = await this.prismaService.floor.findMany({
        where,
        orderBy,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count: number = await this.prismaService.floor.count({
        where,
      });

      convertDatesToString(floors);

      return {
        message: 'Floors loaded successfully.',
        count,
        floors,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findFloorById(floorId: number): Promise<FindOne> {
    try {
      const floor = await this.prismaService.floor.findFirst({
        where: { id: floorId },
      });

      if (!floor) notFound('Floor', floorId);

      return {
        message: `Floor with the id ${floorId} found.`,
        floor,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findFloorRooms(floorId: number, query: FindAllDto): Promise<FindMany> {
    try {
      const floor = await this.prismaService.floor.findFirst({
        where: { id: floorId },
      });

      if (!floor) notFound('Floor', floorId);

      const {
        offset,
        limit,
        search,
        sortBy,
        sortOrder,
        isDeleted,
        isIncomplete,
      } = query;
      const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

      const where: Prisma.RoomWhereInput = isIncomplete
        ? {
            detail: null,
            floorId,
            isDeleted,
          }
        : {
            ...(search && {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { detail: { contains: search, mode: 'insensitive' } },
              ],
            }),
            floorId,
            ...(isDeleted ? { isDeleted } : { isDeleted: false }),
          };

      const rooms = await this.prismaService.room.findMany({
        where,
        orderBy,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.room.count({ where });

      convertDatesToString(rooms);

      return {
        message: `Rooms of the floor with the id ${floorId} found.`,
        count,
        rooms,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findFloorRoomByIds(floorId: number, roomId: number): Promise<FindOne> {
    try {
      const room = await this.prismaService.room.findFirst({
        where: { id: roomId, floorId: floorId },
      });

      if (!room) notFound('Room', roomId, 'Floor', floorId);

      return {
        message: `Room with the id ${roomId} found in floor with the floor id ${floorId}.`,
        room,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async updateFloorById(
    floorId: number,
    updateFloorDto: UpdateFloorDto,
    accessToken: string,
  ): Promise<UpdateById> {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, floor] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.floor.findFirst({
          where: { id: floorId },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!floor) notFound('Floor', floorId);

      await this.prismaService.floor.update({
        where: { id: floorId },
        data: updateFloorDto,
      });

      await this.prismaService.log.create({
        data: {
          userId,
          log: getPreviousValues(floor, updateFloorDto),
          typeId: LogType.FLOOR,
          methodId: LogMethod.UPDATE,
        },
      });

      return {
        message: `Floor with the id ${floorId} updated successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async uploadFloorMapById(
    floorId: number,
    file: Express.Multer.File,
    accessToken: string,
  ) {
    try {
      const id = extractUserId(accessToken, this.jwtService);

      const [user, floor] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id } }),
        this.prismaService.floor.findFirst({ where: { id: floorId } }),
      ]);

      if (!user) notFound(`User`, id);
      if (!floor) notFound(`Floor`, floorId);
      if (!file) throw new BadRequestException(`Floor map is required.`);

      const dir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        Directory.UPLOAD,
        Directory.FLOOR_IMAGES,
      );

      await fs.mkdir(dir, { recursive: true });

      const fileName = generateUniqueSuffix(floorId, file.originalname);

      const filePath = path.join(dir, fileName);

      await fs.writeFile(filePath, file.buffer);

      await this.prismaService.floor.update({
        where: { id: floorId },
        data: { imageLocation: fileName },
      });

      await this.prismaService.log.create({
        data: {
          log: { imageLocation: fileName },
          userId: user.id,
          typeId: LogType.ROOM,
          methodId: LogMethod.UPDATE,
        },
      });

      return {
        message: `Map has been set to the floor with the id ${floorId}`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async softDeleteFloorById(
    floorId: number,
    accessToken: string,
  ): Promise<RemoveById> {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, floor] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.floor.findFirst({
          where: { id: floorId },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!floor) notFound('Floor', floorId);

      await this.prismaService.floor.update({
        where: { id: floorId },
        data: { isDeleted: true },
      });

      await this.prismaService.log.create({
        data: {
          log: { isDeleted: false },
          userId,
          typeId: LogType.FLOOR,
          methodId: LogMethod.SOFT_DELETE,
        },
      });

      return {
        message: `Floor with the id ${floorId} moved to trash.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async deleteFloorById(
    floorId: number,
    accessToken: string,
  ): Promise<RemoveById> {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, floor] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.floor.findFirst({
          where: { id: floorId },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!floor) notFound('Floor', floorId);

      await this.prismaService.floor.delete({ where: { id: floorId } });

      await this.prismaService.log.create({
        data: {
          log: floor,
          userId,
          typeId: LogType.FLOOR,
          methodId: LogMethod.DELETE,
        },
      });

      return {
        message: `Floor with the id ${floorId} deleted successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async retrieveFloorById(
    floorId: number,
    accessToken: string,
  ): Promise<RetrieveById> {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, floor] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.floor.findFirst({
          where: { id: floorId },
        }),
      ]);

      if (!user) notFound('User', userId);
      if (!floor) notFound('Floor', floorId);

      await this.prismaService.floor.update({
        where: { id: floorId },
        data: {
          isDeleted: false,
        },
      });

      await this.prismaService.log.create({
        data: {
          log: { isDeleted: true },
          userId,
          methodId: LogMethod.RETRIEVE,
          typeId: LogType.FLOOR,
        },
      });

      return {
        message: `Floor with the id ${floorId} retrieved.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
