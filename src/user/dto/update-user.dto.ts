import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsInt()
  @IsOptional()
  deptId: number;
}
