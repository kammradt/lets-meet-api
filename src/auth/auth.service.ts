import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRequest } from './dto/register-request';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository) {
  }

  async register(registerRequest: RegisterRequest): Promise<User> {
    return this.userRepository.register(registerRequest);
  }
}
