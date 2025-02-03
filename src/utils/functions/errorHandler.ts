import {
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Messages } from '../enums/enum';

const errorHandler = (
  error: any,
  logger: Logger,
  customMessage?: string,
): void => {
  logger.error(error.message, error.stack);

  if (
    error instanceof NotFoundException ||
    error instanceof BadRequestException ||
    error instanceof UnauthorizedException
  ) {
    throw error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const targetField = Array.isArray(error.meta?.target)
        ? (error.meta.target as string[]).join(', ')
        : 'field';
      throw new BadRequestException(`Duplicate value for ${targetField}.`);
    }

    if (error.code === 'P2025') {
      throw new NotFoundException('The requested resource could not be found.');
    }
  }

  const message = customMessage || Messages.INTERNAL_SERVER;
  throw new InternalServerErrorException(message);
};

export default errorHandler;
