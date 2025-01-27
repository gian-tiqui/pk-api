import { Injectable, Logger } from '@nestjs/common';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LogMethod, LogType, PaginationDefault } from 'src/utils/enums/enum';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import extractUserId from 'src/utils/common/extractUserId';
import getPreviousValues from 'src/utils/functions/getPreviousValues';
import notFound from 'src/utils/functions/notFound';

@Injectable()
export class FloorService {
  private logger: Logger = new Logger('FloorService');

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createFloor(createFloorDto: CreateFloorDto, accessToken: string) {
    try {
      const userId: number = extractUserId(accessToken, this.jwtService);

      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
      });

      if (!user) notFound(`User`, userId);

      const newFloor = await this.prismaService.floor.create({
        data: createFloorDto,
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

  async findFloors(query: FindAllDto) {
    const { offset, limit, search, level, sortBy, sortOrder } = query;
    const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

    try {
      const where: object = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(level && { level }),
        isDeleted: false,
      };

      const floors = await this.prismaService.floor.findMany({
        where,
        orderBy,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.floor.findMany({
        where,
      });

      return {
        message: 'Floors loaded successfully.',
        count,
        floors,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findFloorById(floorId: number) {
    try {
      const floor = await this.prismaService.floor.findFirst({
        where: { id: floorId },
      });

      if (!floor) notFound('Floor', floorId);

      return {
        messaage: `Room with the id ${floorId} found.`,
        floor,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findFloorRooms(floorId: number, query: FindAllDto) {
    try {
      const floor = await this.prismaService.floor.findFirst({
        where: { id: floorId },
      });

      if (!floor) notFound('Floor', floorId);

      const { offset, limit, search, sortBy, sortOrder } = query;
      const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

      const where: object = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ],
        }),
      };

      const rooms = await this.prismaService.room.findMany({
        where,
        orderBy,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.room.count({ where });

      return {
        message: `Rooms of the floor with the id ${floorId} found.`,
        count,
        rooms,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findFloorRoomById(floorId: number, roomId: number) {
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
  ) {
    try {
      const floor = await this.prismaService.floor.findFirst({
        where: { id: floorId },
      });

      if (!floor) notFound('Floor', floorId);

      await this.prismaService.floor.update({
        where: { id: floorId },
        data: updateFloorDto,
      });

      const userId = extractUserId(accessToken, this.jwtService);

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

  async softDeleteFloorById(floorId: number, accessToken: string) {
    try {
      const floor = await this.prismaService.floor.findFirst({
        where: { id: floorId },
      });

      if (!floor) notFound('Floor', floorId);

      await this.prismaService.floor.update({
        where: { id: floorId },
        data: { isDeleted: true },
      });

      const userId = extractUserId(accessToken, this.jwtService);

      await this.prismaService.log.create({
        data: {
          log: { isDeleted: false },
          userId,
          typeId: LogType.FLOOR,
          methodId: LogMethod.SOFT_DELETE,
        },
      });

      return {
        message: 'Floor moved to trash.',
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async deleteFloorById(floorId: number, accessToken: string) {
    try {
      const floor = await this.prismaService.floor.findFirst({
        where: { id: floorId },
      });

      if (!floor) notFound('Floor', floorId);

      await this.prismaService.floor.delete({ where: { id: floorId } });

      const userId = extractUserId(accessToken, this.jwtService);

      await this.prismaService.log.create({
        data: {
          log: floor,
          userId,
          typeId: LogType.FLOOR,
          methodId: LogMethod.DELETE,
        },
      });

      return {
        message: 'Floor deleted successfully.',
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async retrieveFloorById(floorId: number, accessToken: string) {
    try {
      const floor = await this.prismaService.floor.findFirst({
        where: { id: floorId, isDeleted: true },
      });

      if (!floor) notFound('Floor', floorId);

      await this.prismaService.floor.update({
        where: { id: floorId },
        data: {
          isDeleted: true,
        },
      });

      const userId = extractUserId(accessToken, this.jwtService);

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
