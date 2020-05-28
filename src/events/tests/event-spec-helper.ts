import { User } from '../../users/user.entity';
import { Event } from '../event.entity';
import { EventStatus } from '../event-status.enum';
import { EventUpdateRequest } from '../dtos/event-update-request';
import { UserRole } from '../../users/user-role.enum';
import { classToClass } from 'class-transformer';
import { EventRequest } from '../dtos/event-request';
import { EventPaginationOptions } from '../dtos/event-pagination-options';
import { Pagination } from 'nestjs-typeorm-paginate/index';
import { PaginationOptions } from '../../config/typeorm-pagination-options';

const mockUser = new User();

const mockRegularUser = new User();
mockRegularUser.email = 'mock@email.com';
mockRegularUser.role = UserRole.REGULAR;

const mockPremiumUser = classToClass(mockRegularUser);
mockPremiumUser.role = UserRole.PREMIUM;

const mockEvent = new Event();
mockEvent.title = 'EventTitle';
mockEvent.description = 'EventDescription';
mockEvent.status = EventStatus.OPEN;
mockEvent.startDate = new Date();
mockEvent.endDate = new Date(mockEvent.startDate.getTime() + 3600);
mockEvent.maxAttendees = 20;

const mockEventUpdateRequest = new EventUpdateRequest();
mockEventUpdateRequest.title = 'newEventTitle';
mockEventUpdateRequest.description = 'newEventDescription';
mockEventUpdateRequest.maxAttendees = 35;
mockEventUpdateRequest.status = EventStatus.CANCELED;

const mockEventRequest = new EventRequest();
mockEventRequest.title = 'EventTitle';
mockEventRequest.description = 'EventDescription';
mockEventRequest.startDate = new Date();
mockEventRequest.endDate = new Date(this.startDate + 3600);
mockEventRequest.maxAttendees = 25;

const mockUpdatedEvent = {
  ...mockEvent,
  ...mockEventUpdateRequest,
};

const mockEventPaginationOptions = new EventPaginationOptions();
mockEventPaginationOptions.page = 3;
mockEventPaginationOptions.limit = 10;
mockEventPaginationOptions.search = 'search';
mockEventPaginationOptions.status = [EventStatus.DONE];
mockEventPaginationOptions.startDate = new Date().toISOString();
mockEventPaginationOptions.endDate = new Date().toISOString();

const mockEventPaginationResult = new Pagination<Event>([], null, {});

const mockPaginationOptions = new PaginationOptions();
mockPaginationOptions.page = 2;
mockPaginationOptions.limit = 5;
mockPaginationOptions.search = 'hire me pls';

const mockUserPaginationResult = new Pagination<User>([], null, {});

export {
  mockUser,
  mockRegularUser,
  mockPremiumUser,
  mockEvent,
  mockEventUpdateRequest,
  mockEventRequest,
  mockUpdatedEvent,
  mockEventPaginationOptions,
  mockEventPaginationResult,
  mockPaginationOptions,
  mockUserPaginationResult,
};
