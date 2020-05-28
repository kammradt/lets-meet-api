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
import { AttendeeResponse } from './dtos/attendee-response';

@Injectable()
export class EventAttendanceService {
  constructor(
    @InjectRepository(EventAttendanceRepository)
    private eventAttendanceRepository: EventAttendanceRepository,
    private eventService: EventService
  ) {}

  public async attendToEvent(eventId: string, attendee: User): Promise<void> {
    const event = await this.eventService.findById(eventId);

    await this.validateAttendance(event, attendee);

    const eventAttendance = await this.eventAttendanceRepository.findEventAttendance(
      event,
      attendee
    );
    if (this.isAlreadyAnAttendee(eventAttendance)) {
      await this.updateEventAttendance(eventAttendance);
    } else {
      await this.createEventAttendance(attendee, event);
    }
  }

  public async cancelAttendanceToEvent(
    eventId: string,
    attendee: User
  ): Promise<void> {
    const event = await this.eventService.findById(eventId);
    const eventAttendance = await this.eventAttendanceRepository.findEventAttendance(
      event,
      attendee
    );

    await this.validateAttendanceCancellation(event, eventAttendance);

    eventAttendance.cancellation = new Date();
    eventAttendance.confirmation = null;
    await this.eventAttendanceRepository.persist(eventAttendance);
  }

  public async findAttendees(eventId: string): Promise<AttendeeResponse[]> {
    const event = await this.eventService.findById(eventId);
    return await this.eventAttendanceRepository.findEventAttendees(event);
  }

  private async validateAttendance(
    event: Event,
    attendee: User
  ): Promise<void> {
    this.eventService.validateIfEventIsCancelled(event);
    this.eventService.validateIfEventIsDone(event);
    this.validateManagerSelfAttendance(event, attendee);
    await this.validateAttendeeMaxQuantity(event);
  }

  private validateManagerSelfAttendance(event: Event, attendee: User): void {
    if (event.manager.id === attendee.id) {
      throw new UnableToAttendToOwnEventException();
    }
  }

  private async validateAttendeeMaxQuantity(event: Event): Promise<void> {
    const currentAttendeeQuantity = await this.getAttendeesQuantity(event);
    if (currentAttendeeQuantity >= event.maxAttendees) {
      throw new EventReachedMaxAttendeeQuantityException(
        currentAttendeeQuantity
      );
    }
  }

  private async getAttendeesQuantity(event: Event): Promise<number> {
    return await this.eventAttendanceRepository.getAttendeesQuantity(event);
  }

  private async updateEventAttendance(
    eventAttendance: EventAttendance
  ): Promise<void> {
    eventAttendance.confirmation = new Date();
    eventAttendance.cancellation = null;
    await this.eventAttendanceRepository.persist(eventAttendance);
  }

  private async createEventAttendance(
    attendee: User,
    event: Event
  ): Promise<void> {
    const newAttendance = new EventAttendance();
    newAttendance.attendee = attendee;
    newAttendance.event = event;
    newAttendance.confirmation = new Date();
    newAttendance.cancellation = null;
    await this.eventAttendanceRepository.persist(newAttendance);
  }

  private async validateAttendanceCancellation(
    event: Event,
    eventAttendance: EventAttendance
  ): Promise<void> {
    this.validateIfUserWasAnAttendee(eventAttendance);
    this.eventService.validateIfEventIsCancelled(event);
    this.eventService.validateIfEventIsDone(event);
  }

  private validateIfUserWasAnAttendee(eventAttendance: EventAttendance): void {
    if (!this.isAlreadyAnAttendee(eventAttendance)) {
      throw new UserIsNotAnEventAttendeeException();
    }
  }

  private isAlreadyAnAttendee(eventAttendance: EventAttendance) {
    return eventAttendance != null;
  }
}
