import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register-request';
import { User } from './user.entity';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('register')
  register(@Body() registerRequest: RegisterRequest): Promise<User> {
    return this.authService.register(registerRequest);
  }
}
