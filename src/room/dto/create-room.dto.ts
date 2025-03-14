import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import sanitize from 'src/utils/functions/sanitizeInput';
import sanitizeSQL from 'src/utils/functions/sanitizeSQL';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitize(value))
  @Transform(({ value }) => sanitizeSQL(value))
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitize(value))
  @Transform(({ value }) => sanitizeSQL(value))
  code: string;

  @IsInt()
  @IsNotEmpty()
  floorId: number;
}
