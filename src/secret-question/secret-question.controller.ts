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

@Controller('secret-question')
export class SecretQuestionController {
  private logger: Logger = new Logger('SecretQuestionController');

  constructor(private readonly secretQuestionService: SecretQuestionService) {}

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

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.secretQuestionService.findSecretQuestions(query);
  }

  @Get(':secretQuestionId')
  findOne(@Param('secretQuestionId', ParseIntPipe) secretQuestionId: number) {
    return this.secretQuestionService.findSecretQuestionById(secretQuestionId);
  }

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
