import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register-request';
import { LoginRequest } from './dto/login-request';
import { JwtResponse } from './dto/jwt-response';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('register')
  register(@Body() registerRequest: RegisterRequest): Promise<void> {
    return this.authService.register(registerRequest);
  }

  @Post('login')
  login(@Body() loginRequest: LoginRequest): Promise<JwtResponse> {
    return this.authService.login(loginRequest);
  }

}
