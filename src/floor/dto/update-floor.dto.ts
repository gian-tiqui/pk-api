import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateFloorDto {
  @IsString()
  @IsOptional()
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
