import { UserRole } from '../../../users/user-role.enum';

export class AttendeeResponse {
  confirmation?: Date;
  cancellation?: Date;
  id: string;
  email: string;
  role: UserRole;

  static fromQueryBuilder(queryBuilder: any): AttendeeResponse {
    const response = new AttendeeResponse();
    response.id = queryBuilder.attendee.id;
    response.email = queryBuilder.attendee.email;
    response.role = queryBuilder.attendee.role;

    if (queryBuilder.confirmation) {
      response.confirmation = queryBuilder.confirmation;
    }

    if (queryBuilder.cancellation) {
      response.cancellation = queryBuilder.cancellation;
    }

    return response;
  }
}
