import { Test, TestingModule } from '@nestjs/testing';
import { EventAttendanceService } from '../event-attendance.service';
import { EventAttendanceRepository } from '../event-attendance.repository';
import { EventService } from '../../event.service';
import { mockEvent, mockEventAttendance, mockOtherUser, mockUser } from './event-attendance-spec-helper';
import { EventStatus } from '../../event-status.enum';
import { EventRepository } from '../../event.repository';
import { EventCancelledException } from '../../exceptions/event-cancelled.exception';
import { EventDoneException } from '../../exceptions/event-done.exception';
import { UnableToAttendToOwnEventException } from '../exceptions/unable-to-attend-to-own-event.exception';
import { EventReachedMaxAttendeeQuantityException } from '../exceptions/event-reached-max-attendee-quantity.exception';
import { UserIsNotAnEventAttendeeException } from '../exceptions/user-is-not-an-event-attendee.exception';


const mockEventAttendanceRepository = () => ({
  findEventAttendance: jest.fn(),
  persist: jest.fn(),
  getAttendeesQuantity: jest.fn(),
  findEventAttendees: jest.fn(),
  find: jest.fn(),
});

const mockEventRepository = () => ({});

describe('EventAttendanceService', () => {
  let eventAttendanceService: EventAttendanceService;
  let eventService;
  let eventAttendanceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventAttendanceService,
        EventService,
        { provide: EventAttendanceRepository, useFactory: mockEventAttendanceRepository },
        { provide: EventRepository, useFactory: mockEventRepository },
      ],
    }).compile();

    eventAttendanceService = await module.get<EventAttendanceService>(EventAttendanceService);
    eventService = await module.get<EventService>(EventService);
    eventAttendanceRepository = await module.get<EventAttendanceRepository>(EventAttendanceRepository);
  });

  describe('attendToEvent', () => {
    it('should create an attendance to an event', async () => {
      mockEvent.status = EventStatus.OPEN;
      mockEvent.manager = mockOtherUser;
      eventService.findById = jest.fn().mockResolvedValue(mockEvent);

      mockEventAttendance.confirmation = null;
      mockEventAttendance.cancellation = null;
      eventAttendanceRepository.findEventAttendance.mockResolvedValue(mockEventAttendance);
      eventAttendanceRepository.getAttendeesQuantity.mockResolvedValue(20);

      expect(eventAttendanceRepository.findEventAttendance).not.toHaveBeenCalled();
      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();

      await eventAttendanceService.attendToEvent('id', mockUser);

      expect(mockEventAttendance.cancellation).toBeNull();
      expect(mockEventAttendance.confirmation).not.toBeNull();
      expect(eventService.findById).toHaveBeenCalledWith('id');
      expect(eventAttendanceRepository.findEventAttendance).toHaveBeenCalledWith(mockEvent, mockUser);
      expect(eventAttendanceRepository.persist).toHaveBeenCalledTimes(1);
    });

    it('should update an attendance to an event where previously had the presence canceled', async () => {
      mockEvent.status = EventStatus.OPEN;
      mockEvent.manager = mockOtherUser;
      eventService.findById = jest.fn().mockResolvedValue(mockEvent);

      mockEventAttendance.confirmation = null;
      mockEventAttendance.cancellation = new Date();
      eventAttendanceRepository.findEventAttendance.mockResolvedValue(mockEventAttendance);
      eventAttendanceRepository.getAttendeesQuantity.mockResolvedValue(20);

      await eventAttendanceService.attendToEvent('id2', mockUser);

      expect(mockEventAttendance.cancellation).toBeNull();
      expect(mockEventAttendance.confirmation).not.toBeNull();
      expect(eventService.findById).toHaveBeenCalledWith('id2');
      expect(eventAttendanceRepository.findEventAttendance).toHaveBeenCalledWith(mockEvent, mockUser);
      expect(eventAttendanceRepository.persist).toHaveBeenCalledTimes(1);
    });

    it('should try to attend and throw an EventCancelledException', () => {
      mockEvent.status = EventStatus.CANCELED;
      eventService.findById = jest.fn().mockResolvedValue(mockEvent);

      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();

      expect(eventAttendanceService.attendToEvent('id3', mockUser)).rejects.toThrow(EventCancelledException);

      expect(eventService.findById).toHaveBeenCalledWith('id3');
      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();
    });

    it('should try to attend and throw an EventDoneException', () => {
      mockEvent.status = EventStatus.DONE;
      eventService.findById = jest.fn().mockResolvedValue(mockEvent);

      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();

      expect(eventAttendanceService.attendToEvent('id4', mockUser)).rejects.toThrow(EventDoneException);

      expect(eventService.findById).toHaveBeenCalledWith('id4');
      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();
    });

    it('should try to attend to own event and throw an UnableToAttendToOwnEventException ', () => {
      mockEvent.status = EventStatus.OPEN;
      mockEvent.manager = mockUser;
      eventService.findById = jest.fn().mockResolvedValue(mockEvent);

      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();

      expect(eventAttendanceService.attendToEvent('id4', mockUser)).rejects.toThrow(UnableToAttendToOwnEventException);

      expect(eventService.findById).toHaveBeenCalledWith('id4');
      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();
    });

    it('should try to attend an throw an EventReachedMaxAttendeeQuantityException', () => {
      mockEvent.status = EventStatus.OPEN;
      mockEvent.manager = mockOtherUser;
      mockEvent.maxAttendees = 40;
      eventService.findById = jest.fn().mockResolvedValue(mockEvent);
      eventAttendanceRepository.getAttendeesQuantity.mockResolvedValue(40);

      expect(eventAttendanceService.attendToEvent('id5', mockUser)).rejects.toThrow(EventReachedMaxAttendeeQuantityException);

      expect(eventService.findById).toHaveBeenCalledWith('id5');
      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();
    });
  });

  describe('cancelAttendanceToEvent', () => {
    it('should cancel an attendance to an event', async () => {
      mockEvent.status = EventStatus.OPEN;
      mockEvent.manager = mockOtherUser;
      eventService.findById = jest.fn().mockResolvedValue(mockEvent);
      mockEventAttendance.confirmation = new Date();
      mockEventAttendance.cancellation = null;
      eventAttendanceRepository.findEventAttendance.mockResolvedValue(mockEventAttendance);

      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();

      await eventAttendanceService.cancelAttendanceToEvent('id1', mockUser);
      expect(mockEventAttendance.confirmation).toBeNull();
      expect(mockEventAttendance.cancellation).not.toBeNull();
      expect(eventService.findById).toHaveBeenCalledWith('id1');
    });

    it('should try to cancel an attendance to an event that was not attending and throw an UserIsNotAnEventAttendeeException', () => {
      mockEvent.status = EventStatus.OPEN;
      mockEvent.manager = mockOtherUser;
      eventService.findById = jest.fn().mockResolvedValue(mockEvent);
      eventAttendanceRepository.findEventAttendance.mockResolvedValue(null);

      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();

      expect(eventAttendanceService.cancelAttendanceToEvent('id2', mockUser)).rejects.toThrow(UserIsNotAnEventAttendeeException);

      expect(eventService.findById).toHaveBeenCalledWith('id2');
      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();
    });

    it('should try to cancel an attendance to an cancelled event', () => {
      mockEvent.status = EventStatus.CANCELED;
      mockEvent.manager = mockOtherUser;
      eventService.findById = jest.fn().mockResolvedValue(mockEvent);
      eventAttendanceRepository.findEventAttendance.mockResolvedValue(mockEventAttendance);

      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();

      expect(eventAttendanceService.cancelAttendanceToEvent('id3', mockUser)).rejects.toThrow(EventCancelledException);

      expect(eventService.findById).toHaveBeenCalledWith('id3');
      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();
    });

    it('should try to cancel an attendance to an already done event', () => {
      mockEvent.status = EventStatus.DONE;
      mockEvent.manager = mockOtherUser;
      eventService.findById = jest.fn().mockResolvedValue(mockEvent);
      eventAttendanceRepository.findEventAttendance.mockResolvedValue(mockEventAttendance);

      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();

      expect(eventAttendanceService.cancelAttendanceToEvent('id4', mockUser)).rejects.toThrow(EventDoneException);

      expect(eventService.findById).toHaveBeenCalledWith('id4');
      expect(eventAttendanceRepository.persist).not.toHaveBeenCalled();
    });
  });

});
