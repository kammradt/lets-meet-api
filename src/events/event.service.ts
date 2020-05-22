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
    event.status = EventStatus.OPEN;

    this.validate(event, user);

    return await event.save();
  }

  private validate(event: Event, user: User) {
    this.validateNumberOfAttendees(event, user);
  }

  private validateNumberOfAttendees(event: Event, user: User) {
    const maxAttendees = this.getMaxNumberOfAttendeesByRole(user.role)
    if (event.maxAttendees > maxAttendees) {
      throw new UnauthorizedException(`Users that are ${user.role} can only create events with up to ${maxAttendees} attendees`);
      // TODO create custom exception
    }
  }

  private getMaxNumberOfAttendeesByRole(userRole: UserRole): number {
    const maxAttendeesRule = {};
    maxAttendeesRule[UserRole.REGULAR] = 50;
    maxAttendeesRule[UserRole.ADMIN] = 100;
    return maxAttendeesRule[userRole]
  }

  public async getManagedEvents(user: User) {
    return Event.find({
      owner: user,
    });
  }
}
