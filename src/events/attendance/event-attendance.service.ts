import { Injectable } from '@nestjs/common';
import { User } from '../../users/user.entity';
import { EventAttendance } from './event-attendance.entity';
import { EventService } from '../event.service';
import { Event } from '../event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventAttendanceRepository } from './event-attendance.repository';
import { EventReachedMaxAttendeeQuantityException } from './exceptions/event-reached-max-attendee-quantity.exception';
import { UnableToAttendToOwnEventException } from './exceptions/unable-to-attend-to-own-event.exception';
import { UserIsNotAnEventAttendeeException } from './exceptions/user-is-not-an-event-attendee.exception';

@Injectable()
export class EventAttendanceService {
  constructor(
    @InjectRepository(EventAttendanceRepository)
    private eventAttendanceRepository: EventAttendanceRepository,
    private eventService: EventService,
  ) {
  }

  public async attendToEvent(eventId: string, attendee: User): Promise<void> {
    const event = await this.eventService.findById(eventId);

    await this.validateAttendance(event, attendee);

    const eventAttendance = await this.eventAttendanceRepository.findEventAttendance(event, attendee);
    if (this.isAlreadyAnAttendee(eventAttendance)) {
      await this.updateEventAttendance(eventAttendance);
    } else {
      await this.createEventAttendance(attendee, event);
    }
  }

  public async cancelAttendanceToEvent(eventId: string, attendee: User): Promise<void> {
    const event = await this.eventService.findById(eventId);

    const eventAttendance = await this.eventAttendanceRepository.findEventAttendance(event, attendee);
    if (!this.isAlreadyAnAttendee(eventAttendance)) {
      throw new UserIsNotAnEventAttendeeException();
    }

    eventAttendance.cancellation = new Date();
    eventAttendance.confirmation = null;
    await this.eventAttendanceRepository.persist(eventAttendance);
  }

  public async findAttendants(eventId: string): Promise<User[]> {
    const event = await this.eventService.findById(eventId);
    return await this.eventAttendanceRepository.findEventAttendances(event);
  }

  private isAlreadyAnAttendee(eventAttendance: EventAttendance) {
    return eventAttendance != null;
  }

  private async createEventAttendance(attendee: User, event: Event): Promise<void> {
    const newAttendance = new EventAttendance();
    newAttendance.attendee = attendee;
    newAttendance.event = event;
    newAttendance.confirmation = new Date();
    newAttendance.cancellation = null;
    await this.eventAttendanceRepository.persist(newAttendance);
  }

  private async updateEventAttendance(eventAttendance: EventAttendance): Promise<void> {
    eventAttendance.confirmation = new Date();
    eventAttendance.cancellation = null;
    await this.eventAttendanceRepository.persist(eventAttendance);
  }

  private async validateAttendance(event: Event, attendee: User): Promise<void> {
    this.eventService.validateIfEventIsCancelled(event);
    this.eventService.validateIfEventIsDone(event);
    this.validateManagerSelfAttendance(event, attendee);
    await this.validateAttendeeMaxQuantity(event);
  }

  private async validateAttendeeMaxQuantity(event: Event): Promise<void> {
    const currentAttendeeQuantity = await this.getAttendeesQuantity(event);
    if (currentAttendeeQuantity >= event.maxAttendees) {
      throw new EventReachedMaxAttendeeQuantityException(currentAttendeeQuantity);
    }
  }

  private validateManagerSelfAttendance(event: Event, attendee: User): void {
    if (event.manager.id === attendee.id) {
      throw new UnableToAttendToOwnEventException();
    }
  }

  private async getAttendeesQuantity(event: Event): Promise<number> {
    return await this.eventAttendanceRepository.getAttendeeQuantity(event);
  }


}
