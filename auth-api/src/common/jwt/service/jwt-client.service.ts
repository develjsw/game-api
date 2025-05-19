import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtTokenType } from '../type/jwt-token.type';
import { AccessTokenExpireType, RefreshTokenExpireType } from '../type/jwt-token-expire.type';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { JwtTokenEnum } from '../enum/jwt-token.enum';

@Injectable()
export class JwtClientService {
    private readonly accessTokenExpire: AccessTokenExpireType = '10m'; // 10분
    private readonly refreshTokenExpire: RefreshTokenExpireType = '7d'; // 7일

    constructor(private readonly jwtService: JwtService) {}

    async createTokens(
        basePayload: Pick<JwtPayload, 'sub' | 'role'>,
        expireTime?: [AccessTokenExpireType?, RefreshTokenExpireType?]
    ): Promise<JwtTokenType> {
        console.log(basePayload);
        const { sub, role } = basePayload;
        const [accessExpire, refreshExpire] = expireTime ?? [];

        const accessPayload: JwtPayload = {
            sub,
            role,
            type: JwtTokenEnum.ACCESS
        };

        const refreshPayload: JwtPayload = {
            sub,
            role,
            type: JwtTokenEnum.REFRESH
        };

        const accessToken: string = await this.jwtService.signAsync(accessPayload, {
            expiresIn: accessExpire ?? this.accessTokenExpire
        });

        const refreshToken: string = await this.jwtService.signAsync(refreshPayload, {
            expiresIn: refreshExpire ?? this.refreshTokenExpire
        });

        return {
            accessToken,
            refreshToken
        };
    }

    async verifyToken(token: string): Promise<JwtPayload> {
        return await this.jwtService
            .verifyAsync<JwtPayload>(token)
            .then((res: JwtPayload) => res)
            .catch((error: any) => {
                throw new UnauthorizedException('유효하지 않은 토큰입니다.');
            });
    }
}
