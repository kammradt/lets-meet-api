import { Test } from '@nestjs/testing';
import { EventAttendanceRepository } from '../event-attendance.repository';
import { IsNull, Not } from 'typeorm';
import {
  mockEvent,
  mockEventAttendance,
  mockQueryBuilderResult,
  mockQueryBuilderResultMappedToAttendeeResponse,
  mockUser,
} from './event-attendance-spec-helper';

describe('EventRepository', () => {
  let eventAttendanceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EventAttendanceRepository],
    }).compile();

    eventAttendanceRepository = await module.get<EventAttendanceRepository>(EventAttendanceRepository);
  });

  beforeEach(() => {
    eventAttendanceRepository.save = jest.fn();
    eventAttendanceRepository.count = jest.fn();
    eventAttendanceRepository.findOne = jest.fn();
    eventAttendanceRepository.find = jest.fn();
  });

  describe('persist', () => {
    it('should persist an event attendance', () => {
      expect(eventAttendanceRepository.save).not.toHaveBeenCalled();

      expect(eventAttendanceRepository.persist(mockEventAttendance)).resolves.not.toThrow();

      expect(eventAttendanceRepository.save).toHaveBeenCalledWith(mockEventAttendance);
      expect(eventAttendanceRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAttendeesQuantity', () => {
    it('should get the quantity of users going to an event', async () => {
      eventAttendanceRepository.count.mockResolvedValue(10);

      expect(eventAttendanceRepository.count).not.toHaveBeenCalled();

      const result = await eventAttendanceRepository.getAttendeesQuantity(mockEvent);

      expect(result).toBe(10);
      expect(eventAttendanceRepository.count).toHaveBeenCalledWith({
        event: mockEvent, confirmation: Not(IsNull()),
      });
      expect(eventAttendanceRepository.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('findEventAttendance', () => {
    it('should find an event attendance', async () => {
      eventAttendanceRepository.findOne.mockResolvedValue(mockEventAttendance);

      expect(eventAttendanceRepository.findOne).not.toHaveBeenCalled();

      const result = await eventAttendanceRepository.findEventAttendance(mockEvent, mockUser);

      expect(result).toBe(mockEventAttendance);
      expect(eventAttendanceRepository.findOne).toHaveBeenCalledWith({
        event: mockEvent, attendee: mockUser,
      });
      expect(eventAttendanceRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findEventAttendees', () => {
    it('should find a list of AttendeeResponse', async () => {
      eventAttendanceRepository.find.mockResolvedValue(mockQueryBuilderResult);

      expect(eventAttendanceRepository.find).not.toHaveBeenCalled();

      const mappedUsers = await eventAttendanceRepository.findEventAttendees(mockEvent);

      expect(mappedUsers).toEqual(mockQueryBuilderResultMappedToAttendeeResponse);
      expect(eventAttendanceRepository.find).toHaveBeenCalledWith({
        relations: ['attendee'],
        select: ['confirmation'],
        where: { event: mockEvent, confirmation: Not(IsNull()) },
      });
      expect(eventAttendanceRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should find an empty list of users going to an event', async () => {
      eventAttendanceRepository.find.mockResolvedValue([]);

      expect(eventAttendanceRepository.find).not.toHaveBeenCalled();

      const emptyMappedUsers = await eventAttendanceRepository.findEventAttendees(mockEvent);

      expect(emptyMappedUsers).toEqual([]);
      expect(eventAttendanceRepository.find).toHaveBeenCalledWith({
        relations: ['attendee'],
        select: ['confirmation'],
        where: { event: mockEvent, confirmation: Not(IsNull()) },
      });
      expect(eventAttendanceRepository.find).toHaveBeenCalledTimes(1);
    });
  });


});
