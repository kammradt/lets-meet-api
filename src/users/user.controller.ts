import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterRequest } from './dtos/register-request';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RequiredRoles } from '../auth/required-roles.decorator';
import { UserRole } from './user-role.enum';
import { UpdateUserRoleRequest } from './dtos/update-user-role-request';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate/index';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {
  }

  @Post()
  register(@Body() registerRequest: RegisterRequest): Promise<User> {
    return this.userService.register(registerRequest);
  }

  @UseGuards(AuthGuard())
  @Get('me')
  me(@GetUser() user: User): User {
    return user;
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @RequiredRoles(UserRole.ADMIN)
  @Get()
  findUsers(@Query() options: IPaginationOptions): Promise<Pagination<User>> {
    return this.userService.find(options);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @RequiredRoles(UserRole.ADMIN)
  @Patch(':id/role')
  updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserRoleRequest: UpdateUserRoleRequest,
  ): Promise<User> {
    return this.userService.updateRole(id, updateUserRoleRequest);
  }


}
