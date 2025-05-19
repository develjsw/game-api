import { JwtTokenEnum } from '../enum/jwt-token.enum';
import { UserRoleEnum } from '../enum/user-role.enum';

export interface JwtPayloadInterface {
    sub: string; // 유저 ID
    role: UserRoleEnum; // 유저 권한
    type: JwtTokenEnum;
    iat?: number; // 발급 시각
    exp?: number; // 만료 시각
}
