import { Global, Module } from '@nestjs/common';
import { ChangeUserRolePolicy } from './service/change-user-role.policy';

@Global()
@Module({
    imports: [],
    providers: [ChangeUserRolePolicy],
    exports: [ChangeUserRolePolicy]
})
export class RoleModule {}
