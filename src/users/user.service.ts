import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRequest } from './dtos/register-request';
import { UserRole } from './user-role.enum';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateUserRoleRequest } from './dtos/update-user-role-request';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository) {
  }

  public async register(registerRequest: RegisterRequest): Promise<User> {
    const { email, password } = registerRequest;

    const user = new User();
    user.email = email;
    user.role = UserRole.REGULAR;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    return this.userRepository.persist(user);
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }

  public async findById(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public async find(): Promise<User[]> {
    return await this.userRepository.findUsers();
  }

  public async updateRole(id: string, updateUserRoleRequest: UpdateUserRoleRequest): Promise<User> {
    const user = await this.findById(id);
    user.role = updateUserRoleRequest.role;
    return await this.userRepository.persist(user);
  }
}
