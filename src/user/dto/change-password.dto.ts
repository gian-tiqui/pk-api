import { IsNotEmpty, IsString, Min } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Min(8)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Min(8)
  newPassword: string;
}
