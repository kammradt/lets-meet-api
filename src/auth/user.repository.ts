import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterRequest } from './dto/register-request';
import { UserRole } from './enum/user-role.enum';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginRequest } from './dto/login-request';
import * as bcrypt from 'bcryptjs';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

  public async register(registerRequest: RegisterRequest): Promise<void> {
    const { email, password } = registerRequest;

    const user = this.create();
    user.email = email;
    user.role = UserRole.REGULAR;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') { // TODO create a ExceptionGuard
        throw new ConflictException('Username not available');
      } else {
        throw new InternalServerErrorException();
      }

    return user;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
