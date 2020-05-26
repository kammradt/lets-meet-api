import { UserRole } from '../user-role.enum';
import { IsEnum } from 'class-validator';

export class UpdateUserRoleRequest {

  @IsEnum(UserRole)
  role: UserRole;

}
