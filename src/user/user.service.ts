import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import extractUserId from 'src/utils/functions/extractUserId';
import notFound from 'src/utils/functions/notFound';
import { LogMethod, LogType } from 'src/utils/enums/enum';
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
    return `This action returns a #${userId} user`;
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

  async softRemoveUserById(userId: number, accessToken: string) {}

  async removeUserById(userId: number, accessToken: string) {
    return `This action removes a #${userId} user`;
  }
}
