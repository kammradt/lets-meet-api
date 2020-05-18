import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { User } from '../user.entity';
import * as config from 'config';
import { JwtPayload } from '../dto/jwt-payload';

const { secret } = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || secret,
    });
  }

  // Run after decoding the JWT into a JwtPayload.
  // We implement the way we want to validate, and what is returned is injected into our request
  async validate(payload: JwtPayload): Promise<User> {
    return await this.userRepository.findByEmail(payload.email);
  }
}
