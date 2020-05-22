import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EventRequest } from './dtos/event-request';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { plainToClass } from 'class-transformer';
import { EventStatus } from './event-status.enum';
import { UserRole } from '../users/user-role.enum';
import { EventRepository } from './event.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EventUpdateRequest } from './dtos/event-update-request';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
  ) {
  }

  public async create(eventRequest: EventRequest, user: User): Promise<Event> {
    const event = plainToClass(Event, eventRequest);
    event.owner = user;
    event.status = EventStatus.OPEN;

    this.validate(event, user);

    return await event.save();
  }

  public async findManagedEvents(user: User) {
    return Event.find({
      owner: user,
    });
  }

  public async findById(id: string, user: User) {
    const event = await Event.findOne({
      id, owner: user,
    });

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  public async update(id: string, eventUpdateRequest: EventUpdateRequest, user: User): Promise<Event> {
    const event = await this.findById(id, user);

    this.validate(event, user);

    return await this.eventRepository.save({
      ...event,
      ...eventUpdateRequest,
    });
  }

  private validate(event: Event, user: User) {
    this.validateNumberOfAttendees(event, user);
  }

  private validateNumberOfAttendees(event: Event, user: User) {
    const maxAttendees = this.getMaxNumberOfAttendeesByRole(user.role);
    if (event.maxAttendees > maxAttendees) {
      throw new UnauthorizedException(`Users that are ${user.role} can only create events with up to ${maxAttendees} attendees`);
      // TODO create custom exception
    }
  }

  private getMaxNumberOfAttendeesByRole(userRole: UserRole): number {
    const maxAttendeesRule = {};
    maxAttendeesRule[UserRole.REGULAR] = 50;
    maxAttendeesRule[UserRole.ADMIN] = 100;
    return maxAttendeesRule[userRole];
  }


}
