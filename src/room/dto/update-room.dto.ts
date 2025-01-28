export class UpdateRoomDto {}
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  detail: string;

  @IsInt()
  @IsOptional()
  floorId: number;
}
