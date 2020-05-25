import { UnauthorizedException } from '@nestjs/common';

export class EventReachedMaxAttendeeQuantityException extends UnauthorizedException {
  constructor(currentAttendeeQuantity: number) {
    super(`Event already has ${currentAttendeeQuantity} and it is full`);
  }

}
