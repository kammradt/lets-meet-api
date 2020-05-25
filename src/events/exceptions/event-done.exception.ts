import { UnauthorizedException } from '@nestjs/common';
import { Event } from '../event.entity';

export class EventDoneException extends UnauthorizedException {
  constructor(event: Event) {
    super(`Event: ${event.title} is done`);
  }
}
