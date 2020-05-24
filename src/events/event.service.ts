import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventRequest } from './dtos/event-request';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-role.enum';
import { EventRepository } from './event.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EventUpdateRequest } from './dtos/event-update-request';
import { classToClassFromExist, classToPlain, plainToClass } from 'class-transformer';
import { EventStatus } from './event-status.enum';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
  ) {
  }

  public async create(eventRequest: EventRequest, user: User): Promise<Event> {
    const event = plainToClass(Event, eventRequest);
    event.manager = user;
    event.status = EventStatus.OPEN;

    this.validateCreation(event, user);

    return await this.eventRepository.persist(event);
  }

  public async findManagedEventsByUser(user: User): Promise<Event[]> {
    return this.eventRepository.findManagedEventsByUser(user);
  }

  public async findManagedEventById(id: string, user: User): Promise<Event> {
    return this.eventRepository.findManagedEventById(id, user);
  }

  public async update(id: string, eventUpdateRequest: EventUpdateRequest, user: User): Promise<Event> {
    const event = await this.findManagedEventById(id, user);
    this.validateUpdate(event, eventUpdateRequest);

    return await this.eventRepository.updateEvent(event, eventUpdateRequest)
  }

  private validateCreation(event: Event, user: User): void {
    this.validateNumberOfAttendees(event, user);
  }

  private validateUpdate(event: Event, eventUpdateRequest: EventUpdateRequest): void {
    this.validateNumberOfAttendees(event, event.manager);
    // TODO Validate if number of attendees is compatible with new number of maxAttendees
  }

  private validateNumberOfAttendees(event: Event, user: User): void {
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
