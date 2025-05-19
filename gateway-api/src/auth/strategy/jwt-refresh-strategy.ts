import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadInterface } from '../interface/jwt-payload.interface';
import { JwtTokenEnum } from '../enum/jwt-token.enum';
//import { RequestWithCookieInterface } from '../interface/request-with-cookie.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        const jwtSecret: string | undefined = configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
            throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다.');
        }

        super({
            // 토큰 검증 (BearerToken)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 시크릿 키 검증
            secretOrKey: jwtSecret
        });
    }

    validate(payload: JwtPayloadInterface): JwtPayloadInterface {
        if (payload.type !== JwtTokenEnum.REFRESH) {
            throw new UnauthorizedException('Refresh Token만 허용됩니다.');
        }
        console.log('jwt-refresh');
        console.log(payload);
        return payload;
    }
}
