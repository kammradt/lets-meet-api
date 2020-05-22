import { EntityRepository, Repository } from 'typeorm';
import { Event } from './event.entity';


@EntityRepository(Event)
export class EventRepository extends Repository<Event> {

}
