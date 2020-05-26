import { IsDate, IsDateString, IsEnum } from 'class-validator';
import { PaginationOptions } from '../../config/typeorm-pagination-options';
import { EventStatus } from '../event-status.enum';
import moment = require('moment');

const todayMinusOneMonth = moment().subtract(1, 'month').toISOString();
const todayPlusOneMonth = moment().add(1, 'month').toISOString();

export class EventPaginationOptions extends PaginationOptions {

  @IsEnum(EventStatus, { each: true })
  status: EventStatus[] = Object.values(EventStatus);

  @IsDateString()
  startDate: string = todayMinusOneMonth;

  @IsDateString()
  endDate: string = todayPlusOneMonth;

}
