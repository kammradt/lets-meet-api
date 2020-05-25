import { UnauthorizedException } from '@nestjs/common';
import { User } from '../../users/user.entity';

export class InvalidNumberOfMaxAttendeesByUserRoleException extends UnauthorizedException {
  constructor(maxAttendees: number, user: User) {
    super(`Users that are ${user.role} can only create events with up to ${maxAttendees} attendees`);
  }

}
