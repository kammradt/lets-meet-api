import { Event } from '../../event.entity';
import { EventAttendance } from '../event-attendance.entity';
import { User } from '../../../users/user.entity';

const mockEventAttendance = new EventAttendance();
mockEventAttendance.confirmation = new Date();
mockEventAttendance.cancellation = new Date();

const mockEvent = new Event();
mockEvent.maxAttendees = 40;

const mockUser = new User();
mockUser.id = '1';

const mockOtherUser = new User();
mockOtherUser.id = '2';

const mockDate = new Date();
const mockQueryBuilderResult = [
  {
    confirmation: mockDate,
    attendee: { id: '1-1-1', email: '1@mail.com', role: 'REGULAR' },
  },
  {
    confirmation: mockDate,
    attendee: { id: '2-2-2', email: '2@mail.com', role: 'PREMIUM' },
  },
  {
    cancellation: mockDate,
    attendee: { id: '3-3-3', email: '3@mail.com', role: 'REGULAR' },
  },
];
const mockQueryBuilderResultMappedToAttendeeResponse = [
  { confirmation: mockDate, id: '1-1-1', email: '1@mail.com', role: 'REGULAR' },
  { confirmation: mockDate, id: '2-2-2', email: '2@mail.com', role: 'PREMIUM' },
  { cancellation: mockDate, id: '3-3-3', email: '3@mail.com', role: 'REGULAR' },
];

export {
  mockEventAttendance,
  mockEvent,
  mockUser,
  mockOtherUser,
  mockQueryBuilderResult,
  mockQueryBuilderResultMappedToAttendeeResponse,
};
