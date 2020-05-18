import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterRequest } from './dto/register-request';
import { LoginRequest } from './dto/login-request';
import { JwtResponse } from './dto/jwt-response';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from './decorator/get-user.decorator';


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

  @UseGuards(AuthGuard())
  @Get('me')
  me(@GetUser() user: User): User {
    return user;
  }

}
