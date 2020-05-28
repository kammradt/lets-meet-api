import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtResponse } from './dtos/jwt-response';
import { LoginRequest } from './dtos/login-request';
import { UserService } from '../users/user.service';
import { JwtPayload } from './dtos/jwt-payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  public async login(loginRequest: LoginRequest): Promise<JwtResponse> {
    const { email, password } = loginRequest;
    const user = await this.userService.findByEmail(email);

    if (!(await user.hasCorrectPassword(password))) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { email };
    const token: string = await this.jwtService.sign(payload);
    return { token };
  }
}
