import { Injectable, Logger } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import errorHandler from 'src/utils/functions/errorHandler';
import { Prisma } from '@prisma/client';
import { PaginationDefault } from 'src/utils/enums/enum';

@Injectable()
export class DepartmentService {
  private logger: Logger = new Logger('DepartmentService');

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  createDepartment(createDepartmentDto: CreateDepartmentDto) {
    return 'This action adds a new department';
  }

  async findDepartments(query: FindAllDto) {
    try {
      const { search, offset, limit, sortBy, sortOrder } = query;
      const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

      const where: Prisma.DepartmentWhereInput = {
        ...(search && {
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        }),
      };
      const departments = await this.prismaService.department.findMany({
        where,
        orderBy,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.department.count({
        where,
      });

      return {
        message: 'Departments loaded successfully.',
        departments,
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  findDepartmentById(id: number) {
    return `This action returns a #${id} department`;
  }

  updateDepartmentById(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  removeDepartmentById(id: number) {
    return `This action removes a #${id} department`;
  }
}
