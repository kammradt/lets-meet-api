import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enum/user-role.enum';


export const RequiredRoles = (...requiredRoles: UserRole[]) => SetMetadata('roles', requiredRoles);
