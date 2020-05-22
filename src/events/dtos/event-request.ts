import { IsString } from 'class-validator';

export class EventRequest {

  @IsString()
  name: string;

}
