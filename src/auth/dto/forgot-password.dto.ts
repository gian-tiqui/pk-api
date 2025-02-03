import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  answer: string;
}
