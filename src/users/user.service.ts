import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRequest } from './dto/register-request';
import { LoginRequest } from './dto/login-request';
import { JwtService } from '@nestjs/jwt';
import { JwtResponse } from './dto/jwt-response';
import { JwtPayload } from './dto/jwt-payload';
import { UserRole } from './enum/user-role.enum';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService) {
  }

  public async register(registerRequest: RegisterRequest): Promise<void> {
    const { email, password } = registerRequest;

    const user = new User();
    user.email = email;
    user.role = UserRole.REGULAR;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    return this.userRepository.persist(user);
  }

  public async login(loginRequest: LoginRequest): Promise<JwtResponse> {
    const email: string = await this.validateCredentials(loginRequest);
    const payload: JwtPayload = { email };
    const token: string = await this.jwtService.sign(payload);
    return { token };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  private async validateCredentials(loginRequest: LoginRequest): Promise<string> {
    const { email, password } = loginRequest;
    const user = await this.findByEmail(email);

    if (!await user.hasCorrectPassword(password)) {
      throw new UnauthorizedException();
    }

    return user.email;
  }

  private findByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

}
