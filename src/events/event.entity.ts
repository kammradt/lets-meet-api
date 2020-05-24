import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { EventStatus } from './event-status.enum';
import { Exclude, Transform } from 'class-transformer';
import { Min } from 'class-validator';

@Entity('event')
export class Event extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ length: 512, nullable: true })
  description!: string;

  @Column()
  status: EventStatus;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  @Min(1)
  maxAttendees: number;

  @ManyToOne(type => User, manager => manager.managedEvents, { eager: true, onDelete: 'CASCADE' })
  @Exclude()
  manager: User;

}
