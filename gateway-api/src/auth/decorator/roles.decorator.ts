import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../enum/user-role.enum';

export const ROLES_KEY = 'roles';

// roles meta 정보 설정
export const Roles = (...roles: UserRoleEnum[]) => SetMetadata(ROLES_KEY, roles);
