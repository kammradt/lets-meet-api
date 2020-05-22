import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventRequest } from './dtos/event-request';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { plainToClass } from 'class-transformer';
import { EventStatus } from './event-status.enum';
import { UserRole } from '../users/user-role.enum';

@Injectable()
export class EventService {
  constructor() {
  }

  public async create(eventRequest: EventRequest, user: User): Promise<Event> {
    const event = plainToClass(Event, eventRequest);
    event.owner = user;
    event.status = EventStatus.OPEN

    this.validate(event, user)

    return await event.save();
  }

  private validate(event: Event, user: User) {
    this.validateNumberOfAttendees(event, user);
  }

  private validateNumberOfAttendees(event: Event, user: User) {
    if (event.maxAttendees > 50 && user.role == UserRole.REGULAR) {
      throw new UnauthorizedException('Regular users can only create events with up to 50 attendees');
      // TODO create custom exception
    }
  }

}
