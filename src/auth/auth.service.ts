import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

  public sayHello(): string {
    return 'I\'ll try my best!';
  }
}
