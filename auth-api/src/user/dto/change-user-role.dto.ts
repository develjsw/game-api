import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleEnum } from '../../common/role/enum/user-role.enum';

export class ChangeUserRoleDto {
    @IsNotEmpty()
    @IsEnum(UserRoleEnum, { message: '올바르지 않은 역할입니다.' })
    role: UserRoleEnum;

    @IsNotEmpty()
    @IsString()
    code: string;
}
