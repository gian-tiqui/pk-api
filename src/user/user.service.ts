import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import extractUserId from 'src/utils/functions/extractUserId';
import notFound from 'src/utils/functions/notFound';
import { LogMethod, LogType } from 'src/utils/enums/enum';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import getPreviousValues from 'src/utils/functions/getPreviousValues';

@Injectable()
export class UserService {
  private logger: Logger = new Logger('UserService');

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto, accessToken: string) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const userCreator = await this.prismaService.user.findFirst({
        where: { id: userId },
      });

      if (!userCreator) notFound(`User`, userId);

      const user = await this.prismaService.user.findFirst({
        where: {
          OR: [
            { employeeId: createUserDto.employeeId },
            {
              AND: [
                { firstName: createUserDto.firstName },
                { middleName: createUserDto.middleName },
                { lastName: createUserDto.lastName },
              ],
            },
          ],
        },
      });

      if (user)
        throw new BadRequestException(
          `User with the employee userId ${createUserDto.employeeId} found.`,
        );

      const newUser = await this.prismaService.user.create({
        data: createUserDto,
      });

      await this.prismaService.log.create({
        data: {
          userId,
          log: newUser,
          typeId: LogType.USER,
          methodId: LogMethod.CREATE,
        },
      });

      return {
        message: 'User created successfully.',
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findUsers(query: FindAllDto) {
    return `This action returns all user`;
  }

  async findUserById(userId: number) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
        },
      });

      if (!user) notFound(`User`, userId);

      return {
        message: `User with the id ${userId} found.`,
        user,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findUserQuestionAndAnswerById(userId: number) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
        include: { secretQuestion: { select: { question: true } } },
      });

      if (!user) notFound(`User`, userId);

      if (!user.secretQuestionId) {
        return {
          message: 'User does not have a secret yet.',
          secret: 'none',
        };
      }

      return {
        message: 'User secrets loaded successfully.',
        secret: {
          question: user.secretQuestion.question || null,
          answer: user.secretAnswer || null,
        },
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async updateUserById(
    userId: number,
    updateUserDto: UpdateUserDto,
    accessToken: string,
  ) {
    try {
      const updaterId = extractUserId(accessToken, this.jwtService);

      const [updater, user] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: updaterId } }),
        this.prismaService.user.findFirst({ where: { id: userId } }),
      ]);

      if (!updater) notFound(`User`, updaterId);
      if (!user) notFound(`User`, userId);

      await this.prismaService.user.update({
        where: { id: userId },
        data: updateUserDto,
      });

      await this.prismaService.log.create({
        data: {
          log: getPreviousValues(user, updateUserDto),
          userId: updaterId,
          typeId: LogType.USER,
          methodId: LogMethod.UPDATE,
        },
      });

      return {
        message: `User with the id ${userId} updated successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    userId: number,
    accessToken: string,
  ) {
    try {
      const id = extractUserId(accessToken, this.jwtService);

      const [updater, user] = await Promise.all([
        this.prismaService.user.findFirst({
          where: { id },
        }),
        this.prismaService.user.findFirst({
          where: { id: userId },
        }),
      ]);

      if (!updater) notFound(`User`, id);
      if (!user) notFound(`User`, userId);

      const passwordsMatched = await argon.verify(user.password, oldPassword);

      if (!passwordsMatched)
        throw new BadRequestException('You entered an incorrect password.');

      const newHashedPassword = await argon.hash(newPassword);

      await this.prismaService.user.update({
        where: { id: userId },
        data: { password: newHashedPassword },
      });

      await this.prismaService.log.create({
        data: {
          log: { oldPassword },
          userId,
          typeId: LogType.USER,
          methodId: LogMethod.UPDATE,
        },
      });

      return {
        message: `Password of the user with the id ${userId} updated successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async updateUserSecretById(
    userId: number,
    questionId: number,
    answer: string,
    accessToken: string,
  ) {
    try {
      const id = extractUserId(accessToken, this.jwtService);

      const [updater, user] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id } }),
        this.prismaService.user.findFirst({ where: { id: userId } }),
      ]);

      if (!updater) notFound(`User`, id);
      if (!user) notFound(`User`, userId);

      const updatedUser = await this.prismaService.user.update({
        where: { id: userId },
        data: { secretQuestionId: questionId, secretAnswer: answer },
      });

      await this.prismaService.log.create({
        data: {
          log: getPreviousValues(user, updatedUser),
          userId: id,
          typeId: LogType.USER,
          methodId: LogMethod.UPDATE,
        },
      });

      const question = await this.prismaService.secretQuestion.findFirst({
        where: { id: questionId },
      });

      if (!question) notFound(`Question`, questionId);

      return {
        message: `User with the id ${userId} secret updated successfully.`,
        secrets: {
          question: question.question,
          answer: updatedUser.secretAnswer,
        },
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async softRemoveUserById(userId: number, accessToken: string) {}

  async removeUserById(userId: number, accessToken: string) {
    return `This action removes a #${userId} user`;
  }

  async verifyUserPasswordById(
    userId: number,
    password: string,
    accessToken: string,
  ) {
    try {
      const id = extractUserId(accessToken, this.jwtService);

      if (userId !== id) throw new BadRequestException(`Ids mismatch.`);

      const user = await this.prismaService.user.findFirst({
        where: { id },
      });

      const passwordValid = await argon.verify(user.password, password);

      if (!passwordValid)
        throw new BadRequestException(`Password is incorrect.`);

      return {
        message: 'User is verified',
        userId: id,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
