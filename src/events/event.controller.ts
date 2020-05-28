import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { RequiredRoles } from '../auth/required-roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { User } from '../users/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { EventRequest } from './dtos/event-request';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { EventUpdateRequest } from './dtos/event-update-request';
import { Pagination } from 'nestjs-typeorm-paginate/index';
import { EventPaginationOptions } from './dtos/event-pagination-options';
import { AuthGuard } from '@nestjs/passport';

@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @UseGuards(AuthGuard(), RolesGuard)
  @RequiredRoles(UserRole.REGULAR, UserRole.PREMIUM)
  @Post()
  create(
    @Body() eventRequest: EventRequest,
    @GetUser() user: User
  ): Promise<Event> {
    return this.eventService.create(eventRequest, user);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @RequiredRoles(UserRole.REGULAR, UserRole.PREMIUM)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() eventUpdateRequest: EventUpdateRequest,
    @GetUser() user: User
  ): Promise<Event> {
    return this.eventService.update(id, eventUpdateRequest, user);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @RequiredRoles(UserRole.REGULAR, UserRole.PREMIUM)
  @Get('me')
  findManagedEvents(
    @Query() options: EventPaginationOptions,
    @GetUser() user: User
  ): Promise<Pagination<Event>> {
    return this.eventService.findManagedEventsByUser(user, options);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @RequiredRoles(UserRole.REGULAR, UserRole.PREMIUM)
  @Get(':id')
  findManagedEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ): Promise<Event> {
    return this.eventService.findManagedEventById(id, user);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @RequiredRoles(UserRole.ADMIN)
  @Patch(':id/cancel')
  cancel(@Param('id', ParseUUIDPipe) id: string): Promise<Event> {
    return this.eventService.cancel(id);
  }

  @Get()
  findEvents(
    @Query() options: EventPaginationOptions
  ): Promise<Pagination<Event>> {
    return this.eventService.findEvents(options);
  }
}
