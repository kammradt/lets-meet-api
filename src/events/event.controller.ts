import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { RequiredRoles } from '../auth/required-roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { User } from '../users/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { EventRequest } from './dtos/event-request';

@UseGuards(AuthGuard(), RolesGuard)
@RequiredRoles(UserRole.REGULAR)
@Controller('events')
export class EventController {
  constructor() {
  }

  @Post()
  create(
    @Body() eventRequest: EventRequest,
    @GetUser() user: User,
  ): EventRequest {
    return eventRequest;
  }
}
