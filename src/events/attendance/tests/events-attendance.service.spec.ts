import { Test, TestingModule } from '@nestjs/testing';
import { EventAttendanceService } from '../event-attendance.service';
import { EventAttendanceRepository } from '../event-attendance.repository';
import { EventService } from '../../event.service';

const mockEventAttendanceRepository = () => ({});
const mockEventService = () => ({});

describe('EventAttendanceService', () => {
  let eventAttendanceService: EventAttendanceService;
  let eventService: EventService;
  let eventAttendanceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventAttendanceService,
        { provide: EventAttendanceRepository, useFactory: mockEventAttendanceRepository },
        { provide: EventService, useFactory: mockEventService },
      ],
    }).compile();

    eventAttendanceService = module.get<EventAttendanceService>(EventAttendanceService);
    eventService = module.get<EventService>(EventService)
    eventAttendanceRepository = module.get<EventAttendanceRepository>(EventAttendanceRepository);
  });

  describe('', () => {
    it('should ', function() {
      expect(1).toBe(1);
    });
  });

});
