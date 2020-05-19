import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../users/user.entity';
import { JwtPayload } from './dtos/jwt-payload';
import { UserService } from '../users/user.service';
import * as config from 'config';

const { secret } = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || secret,
    });
  }

  // Run after decoding the JWT into a JwtPayload.
  // We implement the way we want to validate, and what is returned is injected into our request
  async validate(payload: JwtPayload): Promise<User> {
    return await this.userService.findByEmail(payload.email);
  }
}
