import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { EventStatus } from '../event-status.enum';

export class EventUpdateRequest {

  @IsOptional()
  @IsString()
  @MinLength(8)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  description!: string;

  @IsOptional()
  @IsDateString()
  startDate!: Date;

  @IsOptional()
  @IsDateString()
  endDate!: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAttendees!: number;

  @IsOptional()
  @IsEnum(EventStatus)
  status!: EventStatus;

}


