import { UnauthorizedException } from '@nestjs/common';
import { Event } from '../event.entity';

export class EventCancelledException extends UnauthorizedException {
  constructor(event: Event) {
    super(`Event: ${event.title} is cancelled`);
  }

}
