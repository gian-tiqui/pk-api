import { Injectable, Logger } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDefault } from 'src/utils/enums/enum';
import { Prisma } from '@prisma/client';
import notFound from 'src/utils/functions/notFound';

@Injectable()
export class ItemService {
  private logger: Logger = new Logger(`ItemService`);

  constructor(private readonly prismaService: PrismaService) {}

  create(createItemDto: CreateItemDto) {
    return 'This action adds a new item';
  }

  async findAll(query: FindAllDto) {
    try {
      const { search, offset, limit } = query;

      const where: Prisma.ItemWhereInput = {
        ...(search && {
          OR: [{ description: { contains: search, mode: 'insensitive' } }],
        }),
      };

      const items = await this.prismaService.item.findMany({
        where,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.item.count({
        where,
      });

      return {
        message: `Items loaded successfully`,
        items,
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findOne(id: string) {
    try {
      const item = await this.prismaService.item.findFirst({ where: { id } });

      if (!item) notFound(`Item`, id);

      return {
        message: `Item with the id ${id} not found.`,
        item,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
