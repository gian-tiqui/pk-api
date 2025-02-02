import { PartialType } from '@nestjs/swagger';
import { CreateSecretQuestionDto } from './create-secret-question.dto';

export class UpdateSecretQuestionDto extends PartialType(
  CreateSecretQuestionDto,
) {}
