import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadInterface } from '../interface/jwt-payload.interface';
import { JwtTokenEnum } from '../enum/jwt-token.enum';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
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
        if (payload.type !== JwtTokenEnum.ACCESS) {
            throw new UnauthorizedException('Access Token만 허용됩니다.');
        }

        return payload;
    }
}
