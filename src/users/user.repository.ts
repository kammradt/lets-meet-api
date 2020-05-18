import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

  public async persist(user: User): Promise<void> {
    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') { // TODO create a ExceptionGuard
        throw new ConflictException('Username not available');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.findOne({ email });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

}
