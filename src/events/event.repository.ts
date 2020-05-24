import { EntityRepository, Repository } from 'typeorm';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { EventUpdateRequest } from './dtos/event-update-request';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {

  public async persist(event: Event): Promise<Event> {
    return await this.save(event);
  }

  public async findManagedEventsByUser(user: User): Promise<Event[]> {
    return await this.find({ manager: user });
  }

  public async findManagedEventById(id: string, user: User): Promise<Event> {
    return await this.findOneOrFail({ id, manager: user });
  }

  public async findById(id: string): Promise<Event> {
    return this.findOneOrFail(id)
  }

  public async updateEvent(event: Event, eventUpdateRequest: EventUpdateRequest): Promise<Event> {
    const saved = await this.save({ ...event, ...eventUpdateRequest });
    delete saved.manager
    return saved;
  }
}
