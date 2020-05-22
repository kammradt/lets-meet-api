import { EntityRepository, Repository } from 'typeorm';
import { Event } from './tests/event.entity';


@EntityRepository(Event)
export class EventRepository extends Repository<Event> {

}
