import { Transform } from 'class-transformer';
import { IsString, IsInt, IsOptional } from 'class-validator';
import sanitize from 'src/utils/functions/sanitizeInput';

export class UpdateFloorDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitize(value))
  name: string;

  @IsInt()
  @IsOptional()
  level: number;

  @IsString()
  @IsOptional()
  code: string;

  @IsInt()
  @IsOptional()
  creatorId: number;
}
