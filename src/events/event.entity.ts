import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { EventStatus } from './event-status.enum';
import { Exclude } from 'class-transformer';
import { Min } from 'class-validator';
import { EventAttendance } from './attendance/event-attendance.entity';

@Entity('event')
export class Event extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ length: 512, nullable: true })
  description?: string;

  @Column()
  status: EventStatus;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  @Min(1)
  maxAttendees: number;

  @ManyToOne(() => User, manager => manager.managedEvents, { eager: true, onDelete: 'CASCADE' })
  @Exclude()
  manager: User;

  @OneToMany(() => EventAttendance, attendees => attendees.event)
  attendees: EventAttendance[];


}
