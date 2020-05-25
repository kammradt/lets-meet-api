import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../users/user.entity';
import { EventStatus } from '../event-status.enum';
import { EventAttendance } from './event-attendance.entity';
import { EventService } from '../event.service';
import { Event } from '../event.entity';

@Injectable()
export class EventAttendanceService {
  constructor(private eventService: EventService) {
  }

  public async attendToEvent(eventId: string, attendee: User): Promise<void> {
    const event = await this.eventService.findById(eventId);

    await this.validateAttendance(event, attendee)

    const eventAttendance = await EventAttendance.findOne({ event, attendee });
    if (!eventAttendance) {
      const newAttendance = new EventAttendance();
      newAttendance.attendee = attendee;
      newAttendance.event = event;
      newAttendance.confirmation = new Date();
      await newAttendance.save();
    } else {
      eventAttendance.confirmation = new Date();
      await eventAttendance.save();
    }
  }

  private async validateAttendance(event: Event, attendee: User): Promise<void> {
    this.eventService.validateIfEventIsCancelled(event)
    this.eventService.validateIfEventIsDone(event)
    this.validateSelfAttendance(event, attendee)
    await this.validateAttendeeMaxQuantity(event)
  }

  private async validateAttendeeMaxQuantity(event: Event) {
    const currentAttendeeQuantity = await this.getAttendeesQuantity(event)
    if (currentAttendeeQuantity >= event.maxAttendees) {
      // Event already full exception
    }
  }

  private validateSelfAttendance(event: Event, attendee: User) {
    if (event.manager.id === attendee.id) {
      // Cannot attendee to own event
    }
  }

  private async getAttendeesQuantity(event: Event): Promise<number> {
    return await EventAttendance.count({ event });
  }

  public async cancelAttendanceToEvent(eventId: string, attendee: User): Promise<void> {
    const event = await this.eventService.findById(eventId);

    const eventAttendance = await EventAttendance.findOne({ event, attendee });
    if (!eventAttendance) {
      throw new UnauthorizedException(); // vc nem ta participando lol
    }

    eventAttendance.cancellation = new Date();
    await eventAttendance.save();
  }

  public async findAttendants(eventId: string): Promise<User[]> {
    const event = await this.eventService.findById(eventId);

    const attendances = await EventAttendance.find({ event });
    const attendantsIds = attendances.map(attendance => attendance.attendeeId)

    return await User.findByIds(attendantsIds);
  }


}
