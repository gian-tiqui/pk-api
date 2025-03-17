import { IsInt, IsNotEmpty, IsObject } from 'class-validator';

export class AddDirectionDto {
  @IsObject()
  @IsNotEmpty()
  directionPattern: object;

  @IsInt()
  @IsNotEmpty()
  startingPoint: number;
}
