import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import extractAccessToken from 'src/utils/functions/extractAccessToken';
import { RateLimit } from 'nestjs-rate-limiter';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  private logger: Logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Post()
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before creating a new user.',
    keyPrefix: 'create-user',
    points: 10,
  })
  create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    try {
      const accessToken = extractAccessToken(req);

      return this.userService.createUser(createUserDto, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Get()
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before loading users.',
    keyPrefix: 'get-users',
    points: 10,
  })
  findAll(@Query() query: FindAllDto) {
    return this.userService.findUsers(query);
  }

  @Get(':userId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before finding a user.',
    keyPrefix: 'find-user',
    points: 10,
  })
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.findUserById(userId);
  }

  @Get(':userId/secret')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before loading the secret of a user.',
    keyPrefix: 'find-user-secret',
    points: 10,
  })
  findSecret(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.findUserQuestionAndAnswerById(userId);
  }

  @Patch(':userId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before updating a user.',
    keyPrefix: 'update-user',
    points: 10,
  })
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.userService.updateUserById(
        userId,
        updateUserDto,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Patch(':userId/change-password')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before changing your password.',
    keyPrefix: 'change-password',
    points: 10,
  })
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.userService.changePassword(
        changePasswordDto.oldPassword,
        changePasswordDto.newPassword,
        userId,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Patch(':userId/update-secret')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before updating your secret.',
    keyPrefix: 'change-secret',
    points: 10,
  })
  changeSecret(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('questionId', ParseIntPipe) questionId: number,
    @Query('answer') answer: string,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.userService.updateUserSecretById(
        userId,
        questionId,
        answer,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':userId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before removing a user.',
    keyPrefix: 'soft-delete-user',
    points: 10,
  })
  softRemove(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.userService.softRemoveUserById(userId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':userId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before purging a user.',
    keyPrefix: 'purge-floor',
    points: 10,
  })
  remove(@Param('userId', ParseIntPipe) userId: number, @Req() req: Request) {
    try {
      const accessToken = extractAccessToken(req);

      return this.userService.removeUserById(userId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Post(':userId/verify')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before verifying your password.',
    keyPrefix: 'verify-user-password',
    points: 10,
  })
  verify(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('password') password: string,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.userService.verifyUserPasswordById(
        userId,
        password,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
