import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRequest } from './dtos/event-request';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-role.enum';
import { EventRepository } from './event.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EventUpdateRequest } from './dtos/event-update-request';
import { plainToClass } from 'class-transformer';
import { EventStatus } from './event-status.enum';
import { InvalidNumberOfMaxAttendeesException } from './exceptions/Invalid-number-of-max-attendees.exception';

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

  public async findById(id: string): Promise<Event> {
    return await this.eventRepository.findById(id)
  }

  public async update(id: string, eventUpdateRequest: EventUpdateRequest, user: User): Promise<Event> {
    const event = await this.findManagedEventById(id, user);
    this.validateUpdate(event, eventUpdateRequest);

    return await this.eventRepository.updateEvent(event, eventUpdateRequest);
  }

  private validateCreation(event: Event, user: User): void {
    this.validateNumberOfAttendees(event, user);
  }

  private validateUpdate(event: Event, eventUpdateRequest: EventUpdateRequest): void {
    this.validateNumberOfAttendees(eventUpdateRequest, event.manager);
    // TODO Validate if number of attendees is compatible with new number of maxAttendees
  }

  private validateNumberOfAttendees(event: Event | EventUpdateRequest, user: User): void {
    const maxAttendees = this.getMaxNumberOfAttendeesByRole(user.role);
    if (event.maxAttendees > maxAttendees) {
      throw new InvalidNumberOfMaxAttendeesException(maxAttendees, user);
    }
  }

  private getMaxNumberOfAttendeesByRole(userRole: UserRole): number {
    const maxAttendeesRule = {
      [UserRole.REGULAR]: 50,
      [UserRole.ADMIN]: 100,
    };
    return maxAttendeesRule[userRole];
  }

}
