import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/user-role.enum';

export const RequiredRoles = (...requiredRoles: UserRole[]) =>
  SetMetadata('roles', requiredRoles);
