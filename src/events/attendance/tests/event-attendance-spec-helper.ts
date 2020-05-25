
const mockEventAttendance = {};
const mockEvent = {};
const mockUser = {};
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
  mockQueryBuilderResult,
  mockQueryBuilderResultMappedToUsers
}
