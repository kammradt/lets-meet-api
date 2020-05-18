import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRequest } from './dto/register-request';
import { LoginRequest } from './dto/login-request';
import { JwtService } from '@nestjs/jwt';
import { JwtResponse } from './dto/jwt-response';
import { JwtPayload } from './dto/jwt-payload';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService) {
  }

  public async register(registerRequest: RegisterRequest): Promise<void> {
    return this.userRepository.register(registerRequest);
  }

  public async login(loginRequest: LoginRequest): Promise<JwtResponse> {
    const email: string = await this.userRepository.validateLogin(loginRequest);
    const payload: JwtPayload = { email };
    const token: string = await this.jwtService.sign(payload);
    return { token };
  }
}
