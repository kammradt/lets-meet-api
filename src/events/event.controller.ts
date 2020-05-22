import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { RequiredRoles } from '../auth/required-roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { User } from '../users/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { EventRequest } from './dtos/event-request';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { EventUpdateRequest } from './dtos/event-update-request';

@UseGuards(AuthGuard(), RolesGuard)
@RequiredRoles(UserRole.REGULAR, UserRole.PREMIUM)
@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {
  }

  @Post()
  create(
    @Body() eventRequest: EventRequest,
    @GetUser() user: User,
  ): Promise<Event> {
    return this.eventService.create(eventRequest, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() eventUpdateRequest: EventUpdateRequest,
    @GetUser() user: User,
  ): Promise<Event> {
    return this.eventService.update(id, eventUpdateRequest, user);
  }

  @Get()
  findManagedEvents(@GetUser() user: User): Promise<Event[]> {
    return this.eventService.findManagedEvents(user);
  }

  @Get(':id')
  findManagedEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<Event> {
    return this.eventService.findById(id, user);
  }

}
