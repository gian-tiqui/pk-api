import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class FindAllDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsInt()
  departmentId?: number;

  @IsOptional()
  @IsInt()
  divisionId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsInt()
  level?: number;

  @IsOptional()
  @IsString()
  sortOrder?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value !== 'true' && value !== 'false') {
      throw new BadRequestException(`isDeleted must be a boolean value.`);
    }
    return value === 'true';
  })
  isDeleted: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value !== 'true' && value !== 'false') {
      throw new BadRequestException(`isDeleted must be a boolean value.`);
    }
    return value === 'true';
  })
  roomImageDeleted: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value !== 'true' && value !== 'false') {
      throw new BadRequestException(`isDeleted must be a boolean value.`);
    }
    return value === 'true';
  })
  isIncomplete?: boolean;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => {
    const converted = parseInt(value, 10);

    if (isNaN(converted))
      throw new BadRequestException(`Starting point must be a numebr`);

    return converted;
  })
  startingPoint: number;
}
