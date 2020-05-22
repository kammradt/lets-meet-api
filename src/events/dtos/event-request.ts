import { IsDateString, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class EventRequest {

  @IsString()
  @MinLength(8)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  description: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  @Min(1)
  maxAttendees: number;

}


