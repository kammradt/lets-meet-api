import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRepository } from './event.repository';
import { AuthModule } from '../auth/auth.module';
import { EventAttendanceService } from './attendance/event-attendance.service';
import { EventAttendanceRepository } from './attendance/event-attendance.repository';
import { EventAttendanceController } from './attendance/event-attendance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventRepository, EventAttendanceRepository]),
    AuthModule,
  ],
  controllers: [EventController, EventAttendanceController],
  providers: [EventService, EventAttendanceService],
})
export class EventModule {}
