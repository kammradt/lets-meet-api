import { EntityRepository, Repository } from 'typeorm';
import { EventAttendance } from './event-attendance.entity';

@EntityRepository(EventAttendance)
export class EventAttendanceRepository extends Repository<EventAttendance> {

}
