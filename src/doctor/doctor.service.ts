import { Injectable, Logger } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import errorHandler from 'src/utils/functions/errorHandler';
import { Prisma } from '@prisma/client';
import { PaginationDefault } from 'src/utils/enums/enum';

@Injectable()
export class DoctorService {
  private logger: Logger = new Logger('DoctorService');
  constructor(private readonly prismaService: PrismaService) {}

  create(createDoctorDto: CreateDoctorDto) {
    return 'This action adds a new doctor';
  }

  async findAll(query: FindAllDto) {
    try {
      const { search, offset, limit } = query;

      const where: Prisma.DoctorWhereInput = {
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { middleName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        }),
      };

      const doctors = await this.prismaService.doctor.findMany({
        where,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.doctor.count({ where });

      return {
        message: `Doctors loaded successfully.`,
        doctors,
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
