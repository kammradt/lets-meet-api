import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.enum';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { Event } from '../events/event.entity';
import { EventAttendance } from '../events/attendance/event-attendance.entity';

@Entity('users')
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: UserRole;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;

  @OneToMany(type => Event, event => event.manager, { eager: false })
  managedEvents: Event[];

  @OneToMany(type => EventAttendance, eventsAttended => eventsAttended.attendee)
  eventsAttended: EventAttendance[];


  async hasCorrectPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

}
