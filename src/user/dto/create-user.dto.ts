import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import sanitize from 'src/utils/functions/sanitizeInput';
import sanitizeSQL from 'src/utils/functions/sanitizeSQL';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitize(value))
  @Transform(({ value }) => sanitizeSQL(value))
  firstName: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitize(value))
  @Transform(({ value }) => sanitizeSQL(value))
  middleName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitize(value))
  @Transform(({ value }) => sanitizeSQL(value))
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitize(value))
  @Transform(({ value }) => sanitizeSQL(value))
  employeeId: string;

  @IsInt()
  @IsNotEmpty()
  deptId: number;
}
