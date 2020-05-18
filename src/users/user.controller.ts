import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterRequest } from './dto/register-request';
import { LoginRequest } from './dto/login-request';
import { JwtResponse } from './dto/jwt-response';


@Controller('users')
export class UserController {
  constructor(private userService: UserService) {
  }

  @Post('register')
  register(@Body() registerRequest: RegisterRequest): Promise<void> {
    return this.userService.register(registerRequest);
  }

  @Post('login')
  login(@Body() loginRequest: LoginRequest): Promise<JwtResponse> {
    return this.userService.login(loginRequest);
  }

}
