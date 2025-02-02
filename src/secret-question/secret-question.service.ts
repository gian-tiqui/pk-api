import { Injectable, Logger } from '@nestjs/common';
import { CreateSecretQuestionDto } from './dto/create-secret-question.dto';
import { UpdateSecretQuestionDto } from './dto/update-secret-question.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import { Prisma } from '@prisma/client';
import { PaginationDefault } from 'src/utils/enums/enum';

@Injectable()
export class SecretQuestionService {
  private logger: Logger = new Logger('SecretQuestionService');

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createSecretQuestion(
    createSecretQuestionDto: CreateSecretQuestionDto,
    accessToken: string,
  ) {
    return 'This action adds a new secretQuestion';
  }

  async findSecretQuestions(query: FindAllDto) {
    const { offset, limit, search, sortBy, sortOrder } = query;
    const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

    try {
      const where: Prisma.SecretQuestionWhereInput = {
        question: { contains: search, mode: 'insensitive' },
      };

      const secretQuestions = await this.prismaService.secretQuestion.findMany({
        where,
        orderBy,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.secretQuestion.count({ where });

      return {
        message: `Secret questions loaded successfully.`,
        secretQuestions,
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findSecretQuestionById(secretQuestionId: number) {
    return `This action returns a #${secretQuestionId} secretQuestion`;
  }

  async updateSecretQuestionById(
    secretQuestionId: number,
    updateSecretQuestionDto: UpdateSecretQuestionDto,
    accessToken: string,
  ) {
    return `This action updates a #${secretQuestionId} secretQuestion`;
  }

  async removeSecretQuestionById(
    secretQuestionId: number,
    accessToken: string,
  ) {
    return `This action removes a #${secretQuestionId} secretQuestion`;
  }
}
