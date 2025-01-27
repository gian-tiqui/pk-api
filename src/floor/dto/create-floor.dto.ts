import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateFloorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  level: number;

  @IsString()
  @IsNotEmpty()
  code: string;
}
