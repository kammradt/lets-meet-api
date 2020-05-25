import { EntityRepository, IsNull, Not, Repository } from 'typeorm';
import { EventAttendance } from './event-attendance.entity';
import { Event } from '../event.entity';
import { User } from '../../users/user.entity';
import { AttendeeResponse } from './dtos/attendee-response';

@EntityRepository(EventAttendance)
export class EventAttendanceRepository extends Repository<EventAttendance> {

  public async persist(attendance: EventAttendance): Promise<void> {
    await this.save(attendance);
  }

  public async getAttendeesQuantity(event: Event): Promise<number> {
    return await this.count({
      event,
      confirmation: Not(IsNull()),
    });
  }

  public async findEventAttendance(event: Event, attendee: User): Promise<EventAttendance> {
    return await this.findOne({ event, attendee });
  }

  public async findEventAttendees(event: Event): Promise<AttendeeResponse[]> {
    const attendances = await this.find({
      relations: ['attendee'],
      select: ['confirmation'],
      where: {
        event,
        confirmation: Not(IsNull()),
      },
    });
    return attendances.map(AttendeeResponse.fromQueryBuilder);
  }
}
