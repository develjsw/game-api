import { Body, Controller, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { JwtTokenType } from '../../common/jwt/type/jwt-token.type';
import { LoginUserDto } from '../../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // 로그인
    @Post('login')
    async login(@Body() dto: LoginUserDto): Promise<JwtTokenType> {
        return await this.authService.login(dto);
    }

    // 토큰 갱신
    @Post('token/renew')
    async renewTokens(@Headers('Authorization') authHeader: string): Promise<JwtTokenType> {
        if (!authHeader) {
            throw new UnauthorizedException('Authorization 헤더가 존재하지 않습니다.');
        }

        const [scheme, token] = authHeader.split(' ');

        if (scheme?.toLowerCase() !== 'bearer' || !token) {
            throw new UnauthorizedException('Bearer 토큰 형식이 아닙니다.');
        }

        return await this.authService.renewTokens(token);
    }
}
