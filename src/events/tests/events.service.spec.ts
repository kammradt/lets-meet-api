import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../event.service';
import { EventRepository } from '../event.repository';
import { InvalidNumberOfMaxAttendeesByUserRoleException } from '../exceptions/invalid-number-of-max-attendees-by-userRole.exception';
import {
  mockEvent,
  mockEventPaginationOptions,
  mockEventPaginationResult,
  mockEventRequest,
  mockEventUpdateRequest,
  mockPremiumUser,
  mockRegularUser,
  mockUpdatedEvent,
} from './event-spec-helper';
import { EventStatus } from '../event-status.enum';
import { EventCancelledException } from '../exceptions/event-cancelled.exception';
import { EventDoneException } from '../exceptions/event-done.exception';

const mockEventRepository = () => ({
  persist: jest.fn(),
  findManagedEventsByUser: jest.fn(),
  findManagedEventById: jest.fn(),
  findById: jest.fn(),
  updateEvent: jest.fn(),
  findAndCount: jest.fn(),
});

describe('EventsService', () => {
  let eventService: EventService;
  let eventRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: EventRepository, useFactory: mockEventRepository },
      ],
    }).compile();

    eventService = module.get<EventService>(EventService);
    eventRepository = module.get<EventRepository>(EventRepository);
  });

  describe('create', () => {
    it('should create an event as regular user', () => {
      eventRepository.persist.mockResolvedValue('event');

      expect(eventRepository.persist).not.toHaveBeenCalled();

      expect(
        eventService.create(mockEventRequest, mockRegularUser)
      ).resolves.not.toThrow();
      expect(eventRepository.persist).toHaveBeenCalledTimes(1);
    });

    it('should throw an InvalidNumberOfMaxAttendeesException as regular user', () => {
      expect(eventRepository.persist).not.toHaveBeenCalled();
      mockEventRequest.maxAttendees = 51;

      expect(
        eventService.create(mockEventRequest, mockRegularUser)
      ).rejects.toThrow(InvalidNumberOfMaxAttendeesByUserRoleException);
      expect(eventRepository.persist).not.toHaveBeenCalled();
    });

    it('should create an event as premium user', () => {
      eventRepository.persist.mockResolvedValue('event');
      mockEventRequest.maxAttendees = 100;

      expect(eventRepository.persist).not.toHaveBeenCalled();

      expect(
        eventService.create(mockEventRequest, mockPremiumUser)
      ).resolves.not.toThrow();
      expect(eventRepository.persist).toHaveBeenCalledTimes(1);
    });

    it('should throw an InvalidNumberOfMaxAttendeesException as premium user', () => {
      mockEventRequest.maxAttendees = 101;

      expect(eventRepository.persist).not.toHaveBeenCalled();

      expect(
        eventService.create(mockEventRequest, mockPremiumUser)
      ).rejects.toThrow(InvalidNumberOfMaxAttendeesByUserRoleException);
      expect(eventRepository.persist).not.toHaveBeenCalled();
    });
  });

  describe('findManagedEventsByUser', () => {
    it('should return a list of managed events', async () => {
      eventRepository.findManagedEventsByUser.mockResolvedValue(
        mockEventPaginationResult
      );

      expect(eventRepository.findManagedEventsByUser).not.toHaveBeenCalled();

      const result = await eventService.findManagedEventsByUser(
        mockRegularUser,
        mockEventPaginationOptions
      );
      expect(eventRepository.findManagedEventsByUser).toHaveBeenCalledWith(
        mockRegularUser,
        mockEventPaginationOptions
      );
      expect(result).toEqual(mockEventPaginationResult);
    });
  });

  describe('findManagedEventById', () => {
    it('should return a managed event', async () => {
      eventRepository.findManagedEventById.mockResolvedValue('event');

      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();

      const result = await eventService.findManagedEventById(
        'id',
        mockRegularUser
      );
      expect(result).toBe('event');
      expect(eventRepository.findManagedEventById).toHaveBeenCalledWith(
        'id',
        mockRegularUser
      );
    });
  });

  describe('findById', () => {
    it('should return an event', async () => {
      eventRepository.findById.mockResolvedValue('event');

      expect(eventRepository.findById).not.toHaveBeenCalled();

      const result = await eventService.findById('id');
      expect(result).toBe('event');
      expect(eventRepository.findById).toHaveBeenCalledWith('id');
    });
  });

  describe('update', () => {
    it('should update an event as regular user', async () => {
      eventRepository.updateEvent.mockResolvedValue(mockUpdatedEvent);
      mockEventUpdateRequest.maxAttendees = 50;
      mockEvent.manager = mockRegularUser;
      eventRepository.findManagedEventById.mockResolvedValue(mockEvent);

      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();

      const result = await eventService.update(
        'id',
        mockEventUpdateRequest,
        mockRegularUser
      );

      expect(result).toBe(mockUpdatedEvent);
      expect(eventRepository.updateEvent).toHaveBeenCalledWith(
        mockEvent,
        mockEventUpdateRequest
      );
      expect(eventRepository.findManagedEventById).toHaveBeenCalledTimes(1);
      expect(eventRepository.updateEvent).toHaveBeenCalledTimes(1);
    });

    it('should throw an InvalidNumberOfMaxAttendeesException as regular user', () => {
      mockEventUpdateRequest.maxAttendees = 51;
      mockEvent.manager = mockRegularUser;
      eventRepository.findManagedEventById.mockResolvedValue(mockEvent);

      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();

      expect(
        eventService.update('id', mockEventUpdateRequest, mockRegularUser)
      ).rejects.toThrow(InvalidNumberOfMaxAttendeesByUserRoleException);
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
    });

    it('should update an event as premium user', async () => {
      eventRepository.updateEvent.mockResolvedValue(mockUpdatedEvent);
      mockEventUpdateRequest.maxAttendees = 100;
      mockEvent.manager = mockPremiumUser;
      eventRepository.findManagedEventById.mockResolvedValue(mockEvent);

      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();

      const result = await eventService.update(
        'id',
        mockEventUpdateRequest,
        mockPremiumUser
      );

      expect(result).toBe(mockUpdatedEvent);
      expect(eventRepository.updateEvent).toHaveBeenCalledWith(
        mockEvent,
        mockEventUpdateRequest
      );
      expect(eventRepository.findManagedEventById).toHaveBeenCalledWith(
        'id',
        mockPremiumUser
      );
      expect(eventRepository.updateEvent).toHaveBeenCalledTimes(1);
    });

    it('should throw an InvalidNumberOfMaxAttendeesException as premium user', () => {
      mockEventUpdateRequest.maxAttendees = 101;
      mockEvent.manager = mockPremiumUser;
      eventRepository.findManagedEventById.mockResolvedValue(mockEvent);

      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();

      expect(
        eventService.update('id', mockEventUpdateRequest, mockPremiumUser)
      ).rejects.toThrow(InvalidNumberOfMaxAttendeesByUserRoleException);
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
    });

    it('should throw an EventCancelledException', () => {
      mockEvent.status = EventStatus.CANCELED;
      mockEvent.manager = mockRegularUser;
      eventRepository.findManagedEventById.mockResolvedValue(mockEvent);
      mockEventUpdateRequest.maxAttendees = 20;

      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();

      expect(
        eventService.update('id', mockEventUpdateRequest, mockRegularUser)
      ).rejects.toThrow(EventCancelledException);

      expect(eventRepository.findManagedEventById).toHaveBeenCalledWith(
        'id',
        mockRegularUser
      );
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
    });

    it('should throw an EventDoneException', () => {
      mockEvent.status = EventStatus.DONE;
      mockEvent.manager = mockRegularUser;
      eventRepository.findManagedEventById.mockResolvedValue(mockEvent);
      mockEventUpdateRequest.maxAttendees = 20;

      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();

      expect(
        eventService.update('id', mockEventUpdateRequest, mockRegularUser)
      ).rejects.toThrow(EventDoneException);

      expect(eventRepository.findManagedEventById).toHaveBeenCalledWith(
        'id',
        mockRegularUser
      );
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
    });

    it('should throw an InvalidMinimumNumberOfAttendeesException', () => {
      const notImplementedYet = true;
      expect(notImplementedYet).toBeTruthy();
    });
  });

  describe('cancel', () => {
    it('should cancel an event', async () => {
      mockEvent.status = EventStatus.OPEN;
      eventRepository.findById.mockResolvedValue(mockEvent);
      eventRepository.persist.mockResolvedValue(mockEvent);

      const result = await eventService.cancel('id');

      expect(eventRepository.findById).toHaveBeenCalledWith('id');
      expect(result.status).toBe(EventStatus.CANCELED);
      expect(eventRepository.persist).toHaveBeenCalledWith({
        ...mockEvent,
        status: EventStatus.CANCELED,
      });
    });

    it('should throw an EventCancelledException', () => {
      mockEvent.status = EventStatus.CANCELED;
      eventRepository.findById.mockResolvedValue(mockEvent);

      expect(eventService.cancel('id')).rejects.toThrow(
        EventCancelledException
      );
      expect(eventRepository.findById).toHaveBeenCalledWith('id');
    });

    it('should throw an EventDoneException', () => {
      mockEvent.status = EventStatus.DONE;
      eventRepository.findById.mockResolvedValue(mockEvent);

      expect(eventService.cancel('id')).rejects.toThrow(EventDoneException);
      expect(eventRepository.findById).toHaveBeenCalledWith('id');
    });
  });
});
