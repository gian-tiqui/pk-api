import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateRoomDto {
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

  @IsInt()
  @IsOptional()
  creatorId: number;
}
