import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordAuthDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
