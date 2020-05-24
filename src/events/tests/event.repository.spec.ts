import { EventRepository } from '../event.repository';
import { Test } from '@nestjs/testing';
import { mockEvent, mockEvents, mockEventUpdateRequest, mockUser } from './event-spec-helper';

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

  describe('persist', () => {
    it('should persist an User', async () => {
      expect(eventRepository.save).not.toHaveBeenCalled();
      eventRepository.save.mockResolvedValue(mockEvent);

      await eventRepository.persist(mockEvent);

      expect(eventRepository.save).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('findManagedEventsByUser', () => {
    it('should find a list of managed events', async () => {
      expect(eventRepository.find).not.toHaveBeenCalled();
      eventRepository.find.mockResolvedValue(mockEvents);

      const result = await eventRepository.findManagedEventsByUser(mockUser);

      expect(result).toBe(mockEvents);
      expect(eventRepository.find).toHaveBeenCalledWith({ manager: mockUser });
    });
  });

  describe('findManagedEventById', () => {
    it('should find a managed event', async () => {
      expect(eventRepository.findOneOrFail).not.toHaveBeenCalled();
      eventRepository.findOneOrFail.mockResolvedValue(mockEvent);

      const result = await eventRepository.findManagedEventById('id', mockUser);

      expect(result).toBe(mockEvent);
      expect(eventRepository.findOneOrFail).toHaveBeenCalledWith({ id: 'id', manager: mockUser });
    });
  });

  describe('findById', () => {
    it('should an event', async () => {
      expect(eventRepository.findOneOrFail).not.toHaveBeenCalled();
      eventRepository.findOneOrFail.mockResolvedValue(mockEvent);

      const result = await eventRepository.findById('id');

      expect(result).toBe(mockEvent);
      expect(eventRepository.findOneOrFail).toHaveBeenCalledWith('id');
    });
  });

  describe('updateEvent', () => {
    it('should a update an event', async () => {
      expect(eventRepository.save).not.toHaveBeenCalled();
      eventRepository.save.mockResolvedValue(mockEventUpdateRequest);

      const result = await eventRepository.updateEvent(mockEvent, mockEventUpdateRequest);

      expect(result).toBe(mockEventUpdateRequest);
      expect(eventRepository.save).toHaveBeenCalledWith({ ...mockEvent, ...mockEventUpdateRequest });
    });
  });


});
