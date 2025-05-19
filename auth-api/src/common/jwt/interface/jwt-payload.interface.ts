import { JwtTokenEnum } from '../enum/jwt-token.enum';
import { UserRoleEnum } from '../../role/enum/user-role.enum';

export interface JwtPayload {
    sub: string; // 유저 ID
    role: UserRoleEnum; // 유저 역할
    type: JwtTokenEnum; // JWT 토큰 타입
    iat?: number; // 생성일
    exp?: number; // 만료일
}
