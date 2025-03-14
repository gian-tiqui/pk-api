import { IsNotEmpty, IsString, Min } from 'class-validator';
import sanitize from 'src/utils/functions/sanitizeInput';
import sanitizeSQL from 'src/utils/functions/sanitizeSQL';
import { Transform } from 'class-transformer';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Min(8)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Min(8)
  @Transform(({ value }) => sanitize(value))
  @Transform(({ value }) => sanitizeSQL(value))
  newPassword: string;
}
