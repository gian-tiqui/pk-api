import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import sanitize from 'src/utils/functions/sanitizeInput';
import sanitizeSQL from 'src/utils/functions/sanitizeSQL';
import { Transform } from 'class-transformer';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitize(value))
  @Transform(({ value }) => sanitizeSQL(value))
  employeeId: string;

  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitize(value))
  @Transform(({ value }) => sanitizeSQL(value))
  answer: string;
}
