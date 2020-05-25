import { Event } from '../../event.entity';
import { EventAttendance } from '../event-attendance.entity';
import { User } from '../../../users/user.entity';

const mockEventAttendance = new EventAttendance();
mockEventAttendance.confirmation = new Date();
mockEventAttendance.cancellation = new Date();

const mockEvent = new Event();
mockEvent.maxAttendees = 40

const mockUser = new User();
mockUser.id = '1'

const mockOtherUser = new User()
mockOtherUser.id = '2'

const mockQueryBuilderResult = [
  {
    attendeeId: '1',
    attendee: { id: '1-1-1', email: '1@mail.com', role: 'REGULAR' },
  },
  {
    attendeeId: '2',
    attendee: { id: '2-2-2', email: '2@mail.com', role: 'PREMIUM' },
  },
];
const mockQueryBuilderResultMappedToUsers = [
  { id: '1-1-1', email: '1@mail.com', role: 'REGULAR' },
  { id: '2-2-2', email: '2@mail.com', role: 'PREMIUM' },
];


export {
  mockEventAttendance,
  mockEvent,
  mockUser,
  mockOtherUser,
  mockQueryBuilderResult,
  mockQueryBuilderResultMappedToUsers,
};
