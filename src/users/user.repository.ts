import { EntityRepository, Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { paginate, Pagination } from 'nestjs-typeorm-paginate/index';
import { PaginationOptions } from '../config/typeorm-pagination-options';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

  public async persist(user: User): Promise<User> {
    return await this.save(user);
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.findOneOrFail({ email });
  }

  public async findUsers(options: PaginationOptions): Promise<Pagination<User>> {
    return await paginate<User>(this, options, {
      where: {
        email: Like(`%${options.search}%`),
      },
    });
  }

  public async findById(id: string): Promise<User> {
    return await this.findOneOrFail(id);
  }
}
