import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterRequest } from './dto/register-request';
import { UserRole } from './enum/user-role.enum';
import * as bcrypt from 'bcryptjs';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

  public async register(registerRequest: RegisterRequest): Promise<User> {
    const { email, password } = registerRequest;

    const user = this.create();
    user.email = email;
    user.role = UserRole.REGULAR;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    await user.save();

    return user;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
