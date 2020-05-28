import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const REGEX = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
const REGEX_MESSAGE =
  'Passwords will contain at least 1 upper case letter. ' +
  'Passwords will contain at least 1 lower case letter. ' +
  'Passwords will contain at least 1 number or special character. ';

export class RegisterRequest {
  @MinLength(8)
  @MaxLength(64)
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(64)
  @IsString()
  @Matches(REGEX, { message: REGEX_MESSAGE })
  password: string;
}
