import {
  EntityRepository,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { EventUpdateRequest } from './dtos/event-update-request';
import { paginate, Pagination } from 'nestjs-typeorm-paginate/index';
import { EventPaginationOptions } from './dtos/event-pagination-options';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  public async persist(event: Event): Promise<Event> {
    return await this.save(event);
  }

  public async findManagedEventsByUser(
    user: User,
    options: EventPaginationOptions
  ): Promise<Pagination<Event>> {
    return await paginate<Event>(this, options, {
      where: {
        title: Like(`%${options.search}%`),
        status: In([].concat(options.status)),
        startDate: MoreThanOrEqual(options.startDate),
        endDate: LessThanOrEqual(options.endDate),
        manager: user,
      },
    });
  }

  public async findManagedEventById(id: string, user: User): Promise<Event> {
    return await this.findOneOrFail({ id, manager: user });
  }

  public async findEvents(
    options: EventPaginationOptions
  ): Promise<Pagination<Event>> {
    return await paginate<Event>(this, options, {
      where: {
        title: Like(`%${options.search}%`),
        status: In([].concat(options.status)),
        startDate: MoreThanOrEqual(options.startDate),
        endDate: LessThanOrEqual(options.endDate),
      },
    });
  }

  public async findById(id: string): Promise<Event> {
    return this.findOneOrFail(id);
  }

  public async updateEvent(
    event: Event,
    eventUpdateRequest: EventUpdateRequest
  ): Promise<Event> {
    const saved = await this.save({ ...event, ...eventUpdateRequest });
    delete saved.manager;
    return saved;
  }
}
