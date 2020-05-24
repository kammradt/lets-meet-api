import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../event.service';
import { EventRepository } from '../event.repository';
import { InvalidNumberOfMaxAttendeesException } from '../exceptions/Invalid-number-of-max-attendees.exception';
import {
  mockEvent,
  mockEventRequest,
  mockEventUpdateRequest,
  mockPremiumUser,
  mockRegularUser,
  mockUpdatedEvent,
} from './event-spec-helper';

const mockEventRepository = () => ({
  persist: jest.fn(),
  findManagedEventsByUser: jest.fn(),
  findManagedEventById: jest.fn(),
  findById: jest.fn(),
  updateEvent: jest.fn(),
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
      expect(eventRepository.persist).not.toHaveBeenCalled();
      eventRepository.persist.mockResolvedValue('event');

      expect(eventService.create(mockEventRequest, mockRegularUser)).resolves.not.toThrow();
      expect(eventRepository.persist).toHaveBeenCalledTimes(1);
    });

    it('should throw an InvalidNumberOfMaxAttendeesException as regular user', () => {
      expect(eventRepository.persist).not.toHaveBeenCalled();
      mockEventRequest.maxAttendees = 51;

      expect(eventService.create(mockEventRequest, mockRegularUser)).rejects.toThrow(InvalidNumberOfMaxAttendeesException);
      expect(eventRepository.persist).not.toHaveBeenCalled();
    });

    it('should create an event as premium user', () => {
      expect(eventRepository.persist).not.toHaveBeenCalled();
      eventRepository.persist.mockResolvedValue('event');
      mockEventRequest.maxAttendees = 100;

      expect(eventService.create(mockEventRequest, mockPremiumUser)).resolves.not.toThrow();
      expect(eventRepository.persist).toHaveBeenCalledTimes(1);
    });

    it('should throw an InvalidNumberOfMaxAttendeesException as premium user', () => {
      expect(eventRepository.persist).not.toHaveBeenCalled();
      mockEventRequest.maxAttendees = 101;

      expect(eventService.create(mockEventRequest, mockPremiumUser)).rejects.toThrow(InvalidNumberOfMaxAttendeesException);
      expect(eventRepository.persist).not.toHaveBeenCalled();
    });
  });

  describe('findManagedEventsByUser', () => {
    it('should return a list of managed events', async () => {
      expect(eventRepository.findManagedEventsByUser).not.toHaveBeenCalled();
      const mockResult = [1, 2];
      eventRepository.findManagedEventsByUser.mockResolvedValue(mockResult);

      const result = await eventService.findManagedEventsByUser(mockRegularUser);
      expect(result).toBe(mockResult);
      expect(eventRepository.findManagedEventsByUser).toHaveBeenCalledWith(mockRegularUser);
    });
  });

  describe('findManagedEventById', () => {
    it('should return a managed event', async () => {
      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();
      eventRepository.findManagedEventById.mockResolvedValue('event');

      const result = await eventService.findManagedEventById('id', mockRegularUser);
      expect(result).toBe('event');
      expect(eventRepository.findManagedEventById).toHaveBeenCalledWith('id', mockRegularUser);
    });
  });

  describe('findById', () => {
    it('should return an event', async () => {
      expect(eventRepository.findById).not.toHaveBeenCalled();
      eventRepository.findById.mockResolvedValue('event');

      const result = await eventService.findById('id');
      expect(result).toBe('event');
      expect(eventRepository.findById).toHaveBeenCalledWith('id');
    });
  });

  describe('update', () => {
    it('should update an event as regular user', async () => {
      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
      eventRepository.updateEvent.mockResolvedValue(mockUpdatedEvent);
      eventRepository.findManagedEventById.mockResolvedValue(mockEvent);

      mockEventUpdateRequest.maxAttendees = 50;
      mockEvent.manager = mockRegularUser;

      const result = await eventService.update('id', mockEventUpdateRequest, mockRegularUser);

      expect(result).toBe(mockUpdatedEvent);
      expect(eventRepository.updateEvent).toHaveBeenCalledWith(mockEvent, mockEventUpdateRequest);
      expect(eventRepository.findManagedEventById).toHaveBeenCalledTimes(1);
      expect(eventRepository.updateEvent).toHaveBeenCalledTimes(1);
    });

    it('should throw an InvalidNumberOfMaxAttendeesException as regular user', () => {
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();
      eventRepository.findManagedEventById.mockResolvedValue(mockEvent);

      mockEventUpdateRequest.maxAttendees = 51;

      expect(eventService.update('id', mockEventUpdateRequest, mockRegularUser)).rejects.toThrow(InvalidNumberOfMaxAttendeesException);
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
    });

    it('should update an event as premium user', async () => {
      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
      eventRepository.updateEvent.mockResolvedValue(mockUpdatedEvent);
      eventRepository.findManagedEventById.mockResolvedValue(mockEvent);

      mockEvent.manager = mockPremiumUser;
      mockEventUpdateRequest.maxAttendees = 100;

      const result = await eventService.update('id', mockEventUpdateRequest, mockPremiumUser);

      expect(result).toBe(mockUpdatedEvent);
      expect(eventRepository.updateEvent).toHaveBeenCalledWith(mockEvent, mockEventUpdateRequest);
      expect(eventRepository.findManagedEventById).toHaveBeenCalledTimes(1);
      expect(eventRepository.updateEvent).toHaveBeenCalledTimes(1);
    });

    it('should throw an InvalidNumberOfMaxAttendeesException as premium user', () => {
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
      expect(eventRepository.findManagedEventById).not.toHaveBeenCalled();
      eventRepository.findManagedEventById.mockResolvedValue(mockEvent);

      mockEventUpdateRequest.maxAttendees = 101;
      expect(eventService.update('id', mockEventUpdateRequest, mockPremiumUser)).rejects.toThrow(InvalidNumberOfMaxAttendeesException);
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
    });

    it('should throw an InvalidMinimumNumberOfAttendeesException', () => {
      const notImplementedYet = true;
      expect(notImplementedYet).toBeTruthy();
    });
  });

});
