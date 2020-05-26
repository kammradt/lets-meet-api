import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate/index';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

  public async persist(user: User): Promise<User> {
    return await this.save(user);
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.findOneOrFail({ email });
  }

  public async findUsers(options: IPaginationOptions): Promise<Pagination<User>> {
    return await paginate<User>(this, options)
  }

  public async findById(id: string): Promise<User> {
    return await this.findOneOrFail(id);
  }
}
