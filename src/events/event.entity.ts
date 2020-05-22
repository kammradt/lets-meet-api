import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { EventStatus } from './event-status.enum';
import { Exclude } from 'class-transformer';

@Entity('events')
export class Event extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ length: 512, nullable: true })
  description: string;

  @Column()
  status: EventStatus;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  maxAttendees: number;

  @Exclude()
  @ManyToOne(type => User, owner => owner.events, { eager: false, onDelete: 'CASCADE' })
  owner: User;

}
