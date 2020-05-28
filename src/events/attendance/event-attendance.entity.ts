import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { Event } from '../event.entity';

@Entity('event_attendance')
export class EventAttendance extends BaseEntity {
  @PrimaryColumn()
  attendeeId: string;

  @PrimaryColumn()
  eventId: string;

  @ManyToOne(
    () => User,
    user => user.eventsAttended
  )
  attendee: User;

  @ManyToOne(
    () => Event,
    event => event.attendees
  )
  event: Event;

  @Column({ nullable: true })
  confirmation: Date;

  @Column({ nullable: true })
  cancellation: Date;
}
