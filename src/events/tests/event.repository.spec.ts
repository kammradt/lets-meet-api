import { EventRepository } from '../event.repository';
import { Test } from '@nestjs/testing';
import { Event } from '../event.entity';
import { User } from '../../users/user.entity';
import { EventStatus } from '../event-status.enum';
import { EventUpdateRequest } from '../dtos/event-update-request';

describe('EventRepository', () => {
  let eventRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EventRepository],
    }).compile();

    eventRepository = await module.get<EventRepository>(EventRepository);
  });

  beforeEach(() => {
    eventRepository.save = jest.fn();
    eventRepository.find = jest.fn();
    eventRepository.findOneOrFail = jest.fn();
  });

  const mockUser = new User();

  const mockEvent0 = new Event();
  mockEvent0.title = 'EventTitle'
  mockEvent0.description = 'EventDescription'
  mockEvent0.status = EventStatus.OPEN
  mockEvent0.startDate = new Date()
  mockEvent0.endDate = new Date(mockEvent0.startDate.getTime() + 3600)
  mockEvent0.maxAttendees = 20

  const mockEvent1 = new Event();
  const mockEvents = [mockEvent0, mockEvent1]

  const mockEventUpdateRequest = new EventUpdateRequest();

  const mockEventUpdated = new Event();
  mockEventUpdated.title = 'newEventTitle'
  mockEventUpdated.description = 'eventEventDescription'
  mockEventUpdated.status = EventStatus.OPEN
  mockEventUpdated.startDate = new Date()
  mockEventUpdated.endDate = new Date(mockEvent0.startDate.getTime() + 3600)
  mockEventUpdated.maxAttendees = 20

  describe('persist', () => {
    it('should persist an User', async () => {
      expect(eventRepository.save).not.toHaveBeenCalled();
      eventRepository.save.mockResolvedValue(mockEvent0);

      await eventRepository.persist(mockEvent0);

      expect(eventRepository.save).toHaveBeenCalledWith(mockEvent0);
    });
  });

  describe('findManagedEventsByUser', () => {
    it('should find a list of managed events', async () => {
      expect(eventRepository.find).not.toHaveBeenCalled()
      eventRepository.find.mockResolvedValue(mockEvents)

      const result = await eventRepository.findManagedEventsByUser(mockUser)

      expect(result).toBe(mockEvents)
      expect(eventRepository.find).toHaveBeenCalledWith({ manager: mockUser })
    });
  });

  describe('findManagedEventById', () => {
    it('should a managed event', async () => {
      expect(eventRepository.findOneOrFail).not.toHaveBeenCalled()
      eventRepository.findOneOrFail.mockResolvedValue(mockEvent0)

      const result = await eventRepository.findManagedEventById('someId', mockUser)

      expect(result).toBe(mockEvent0)
      expect(eventRepository.findOneOrFail).toHaveBeenCalledWith({ id: 'someId', manager: mockUser })
    });
  });

  describe('updateEvent', () => {
    it('should a update an event', async () => {
      expect(eventRepository.save).not.toHaveBeenCalled();
      eventRepository.save.mockResolvedValue(mockEventUpdateRequest)

      const result = await eventRepository.updateEvent(mockEvent0, mockEventUpdateRequest);

      expect(result).toBe(mockEventUpdateRequest)
      expect(eventRepository.save).toHaveBeenCalledWith({...mockEvent0, ...mockEventUpdateRequest})
    });
  });


});
