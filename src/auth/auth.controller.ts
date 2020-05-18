import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest } from './dtos/login-request';
import { JwtResponse } from './dtos/jwt-response';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post()
  login(@Body() loginRequest: LoginRequest): Promise<JwtResponse> {
    return this.authService.login(loginRequest);
  }

}
