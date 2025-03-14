import { Transform } from 'class-transformer';
import { IsString, IsInt, IsOptional } from 'class-validator';
import sanitize from 'src/utils/functions/sanitizeInput';
import sanitizeSQL from 'src/utils/functions/sanitizeSQL';

export class UpdateFloorDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitize(value))
  @Transform(({ value }) => sanitizeSQL(value))
  name: string;

  @IsInt()
  @IsOptional()
  level: number;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitize(value))
  @Transform(({ value }) => sanitizeSQL(value))
  code: string;

  @IsInt()
  @IsOptional()
  creatorId: number;
}
