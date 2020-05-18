import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterRequest } from './dtos/register-request';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {
  }

  @Post()
  register(@Body() registerRequest: RegisterRequest): Promise<void> {
    return this.userService.register(registerRequest);
  }

  @UseGuards(AuthGuard())
  @Get()
  me(@GetUser() user: User): User {
    return user;
  }

}
