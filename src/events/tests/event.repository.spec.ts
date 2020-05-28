import { EventRepository } from '../event.repository';
import { Test } from '@nestjs/testing';
import {
  mockEvent,
  mockEventPaginationOptions,
  mockEventPaginationResult,
  mockEventUpdateRequest,
  mockUser,
} from './event-spec-helper';
import * as nestjsTypeormPaginate from 'nestjs-typeorm-paginate/index';
import { In, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';

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
    eventRepository.paginate = jest.fn();
    eventRepository.findAndCount = jest.fn();
  });

  describe('persist', () => {
    it('should persist an User', async () => {
      eventRepository.save.mockResolvedValue(mockEvent);

      expect(eventRepository.save).not.toHaveBeenCalled();

      await eventRepository.persist(mockEvent);

      expect(eventRepository.save).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('findManagedEventsByUser', () => {
    it('should find a list of managed events', async () => {
      const paginate = jest.spyOn(nestjsTypeormPaginate, 'paginate');
      paginate.mockResolvedValue(mockEventPaginationResult);

      expect(paginate).not.toHaveBeenCalled();

      const result = await eventRepository.findManagedEventsByUser(
        mockUser,
        mockEventPaginationOptions
      );
      expect(paginate).toHaveBeenCalledWith(
        eventRepository,
        mockEventPaginationOptions,
        {
          where: {
            title: Like(`%${mockEventPaginationOptions.search}%`),
            status: In([].concat(mockEventPaginationOptions.status)),
            startDate: MoreThanOrEqual(mockEventPaginationOptions.startDate),
            endDate: LessThanOrEqual(mockEventPaginationOptions.endDate),
            manager: mockUser,
          },
        }
      );
      expect(result).toEqual(mockEventPaginationResult);
    });
  });

  describe('findManagedEventById', () => {
    it('should find a managed event', async () => {
      eventRepository.findOneOrFail.mockResolvedValue(mockEvent);

      expect(eventRepository.findOneOrFail).not.toHaveBeenCalled();

      const result = await eventRepository.findManagedEventById('id', mockUser);

      expect(result).toBe(mockEvent);
      expect(eventRepository.findOneOrFail).toHaveBeenCalledWith({
        id: 'id',
        manager: mockUser,
      });
    });
  });

  describe('findById', () => {
    it('should find an event', async () => {
      eventRepository.findOneOrFail.mockResolvedValue(mockEvent);

      expect(eventRepository.findOneOrFail).not.toHaveBeenCalled();

      const result = await eventRepository.findById('id');

      expect(result).toBe(mockEvent);
      expect(eventRepository.findOneOrFail).toHaveBeenCalledWith('id');
    });
  });

  describe('updateEvent', () => {
    it('should a update an event', async () => {
      eventRepository.save.mockResolvedValue(mockEventUpdateRequest);

      expect(eventRepository.save).not.toHaveBeenCalled();

      const result = await eventRepository.updateEvent(
        mockEvent,
        mockEventUpdateRequest
      );

      expect(result).toBe(mockEventUpdateRequest);
      expect(eventRepository.save).toHaveBeenCalledWith({
        ...mockEvent,
        ...mockEventUpdateRequest,
      });
    });
  });
});
