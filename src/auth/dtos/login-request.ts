import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequest {
  @MinLength(8)
  @MaxLength(64)
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(64)
  @IsString()
  password: string;
}
