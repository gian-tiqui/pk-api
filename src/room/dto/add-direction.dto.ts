import { IsNotEmpty, IsObject } from 'class-validator';

export class AddDirectionDto {
  @IsObject()
  @IsNotEmpty()
  directions: object;
}
