import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Req,
  Logger,
} from '@nestjs/common';
import { SecretQuestionService } from './secret-question.service';
import { CreateSecretQuestionDto } from './dto/create-secret-question.dto';
import { UpdateSecretQuestionDto } from './dto/update-secret-question.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import extractAccessToken from 'src/utils/functions/extractAccessToken';
import { RateLimit } from 'nestjs-rate-limiter';

@Controller('secret-question')
export class SecretQuestionController {
  private logger: Logger = new Logger('SecretQuestionController');

  constructor(private readonly secretQuestionService: SecretQuestionService) {}

  @RateLimit({
    keyPrefix: 'create-secret-question',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before creating a secret question.',
  })
  @Post()
  create(
    @Body() createSecretQuestionDto: CreateSecretQuestionDto,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.secretQuestionService.createSecretQuestion(
        createSecretQuestionDto,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @RateLimit({
    keyPrefix: 'find-secret-questions',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before loading secret questions.',
  })
  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.secretQuestionService.findSecretQuestions(query);
  }

  @RateLimit({
    keyPrefix: 'find-secret-question',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before loading a secret question.',
  })
  @Get(':secretQuestionId')
  findOne(@Param('secretQuestionId', ParseIntPipe) secretQuestionId: number) {
    return this.secretQuestionService.findSecretQuestionById(secretQuestionId);
  }

  @RateLimit({
    keyPrefix: 'update-secret-question',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before updating a secret question.',
  })
  @Patch(':secretQuestionId')
  update(
    @Param('secretQuestionId', ParseIntPipe) secretQuestionId: number,
    @Body() updateSecretQuestionDto: UpdateSecretQuestionDto,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.secretQuestionService.updateSecretQuestionById(
        secretQuestionId,
        updateSecretQuestionDto,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':secretQuestionId')
  @RateLimit({
    keyPrefix: 'remove-secret-question',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before removing a secret question.',
  })
  remove(
    @Param('secretQuestionId', ParseIntPipe) secretQuestionId: number,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.secretQuestionService.removeSecretQuestionById(
        secretQuestionId,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
