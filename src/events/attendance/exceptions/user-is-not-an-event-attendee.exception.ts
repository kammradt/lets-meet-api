import { UnauthorizedException } from '@nestjs/common';

export class UserIsNotAnEventAttendeeException extends UnauthorizedException {
  constructor() {
    super(`You are not able to cancel an attendance to an event that you are not in`);
  }

}
