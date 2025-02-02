import { Module } from '@nestjs/common';
import { SecretQuestionService } from './secret-question.service';
import { SecretQuestionController } from './secret-question.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SecretQuestionController],
  providers: [SecretQuestionService, PrismaService, JwtService],
})
export class SecretQuestionModule {}
