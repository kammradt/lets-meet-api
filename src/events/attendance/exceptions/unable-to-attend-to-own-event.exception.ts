import { UnauthorizedException } from '@nestjs/common';

export class UnableToAttendToOwnEventException extends UnauthorizedException {
  constructor() {
    super(`You are not able to attend to you own Event`);
  }
}
