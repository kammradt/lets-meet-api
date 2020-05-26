import {
  mockQueryBuilderResult,
  mockQueryBuilderResultMappedToAttendeeResponse,
} from './event-attendance-spec-helper';
import { AttendeeResponse } from '../dtos/attendee-response';

describe('AttendeeResponse', () => {

  it('should map a Query builder result to AttendeeResponse', () => {
    const result = mockQueryBuilderResult.map(AttendeeResponse.fromQueryBuilder);
    expect(result).toEqual(mockQueryBuilderResultMappedToAttendeeResponse);
  });

});
