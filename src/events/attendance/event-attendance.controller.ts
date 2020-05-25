import { Controller, Delete, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles.guard';
import { RequiredRoles } from '../../auth/required-roles.decorator';
import { EventAttendanceService } from './event-attendance.service';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../users/user.entity';
import { UserRole } from '../../users/user-role.enum';

@UseGuards(AuthGuard(), RolesGuard)
@RequiredRoles(UserRole.REGULAR, UserRole.PREMIUM)
@Controller('events')
export class EventAttendanceController {
  constructor(private eventAttendanceService: EventAttendanceService) {
  }

  @Patch(':eventId/attendance')
  attendToEvent(@Param('eventId', ParseUUIDPipe) eventId: string, @GetUser() user: User): Promise<void> {
    return this.eventAttendanceService.attendToEvent(eventId, user);
  }

  @Delete(':eventId/attendance')
  cancelAttendanceToEvent(@Param('eventId', ParseUUIDPipe) eventId: string, @GetUser() user: User): Promise<void> {
    return this.eventAttendanceService.cancelAttendanceToEvent(eventId, user);
  }

  @Get(':eventId/attendance')
  findAttendees(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.eventAttendanceService.findAttendees(eventId);
  }

}
