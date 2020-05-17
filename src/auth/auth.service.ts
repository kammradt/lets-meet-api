import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRequest } from './dto/register-request';
import { LoginRequest } from './dto/login-request';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository) {
  }

  public async register(registerRequest: RegisterRequest): Promise<void> {
    return this.userRepository.register(registerRequest);
  }
}
