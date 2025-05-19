import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisClientService } from '../../common/redis/service/redis-client.service';
import { JwtPayload } from '../../common/jwt/interface/jwt-payload.interface';
import { JwtTokenType } from '../../common/jwt/type/jwt-token.type';
import { LoginUserDto } from '../../user/dto/login-user.dto';
import { USER_REPOSITORY_INTERFACE, UserRepositoryInterface } from '../../user/interface/user-repository.interface';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../../user/schema/user.schema';
import { JwtClientService } from '../../common/jwt/service/jwt-client.service';
import { JwtTokenEnum } from '../../common/jwt/enum/jwt-token.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly redisClientService: RedisClientService,
        private readonly jwtClientService: JwtClientService,

        @Inject(USER_REPOSITORY_INTERFACE)
        private readonly userRepository: UserRepositoryInterface
    ) {}

    async login(dto: LoginUserDto): Promise<JwtTokenType> {
        const { password, email } = dto;

        const findUserResult: UserDocument | null = await this.userRepository.findUserWithPasswordByConditions({
            email
        });
        if (!findUserResult) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        const isPasswordMatch: boolean = await bcrypt.compare(password, findUserResult.password);
        if (!isPasswordMatch) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        // 토큰 발급
        const payload = { sub: String(findUserResult._id), role: findUserResult.role };
        const { accessToken, refreshToken } = await this.jwtClientService.createTokens(payload);

        // 리프레시 토큰 - 레디스 저장
        await this.redisClientService.set(`refresh:${payload.sub}`, refreshToken, 60 * 60 * 24 * 7); // 토큰 만료 시간과 동일하게 7일

        return { accessToken, refreshToken };
    }

    async renewTokens(oldRefreshToken: string): Promise<JwtTokenType> {
        const payload: JwtPayload = await this.jwtClientService.verifyToken(oldRefreshToken);

        // 토큰 타입 검증
        if (payload.type !== JwtTokenEnum.REFRESH) {
            throw new UnauthorizedException('Refresh Token만 사용할 수 있습니다.');
        }

        const savedToken: string | null = await this.redisClientService.get(`refresh:${payload.sub}`);
        if (savedToken !== oldRefreshToken) {
            throw new UnauthorizedException('잘못된 토큰 매칭입니다.');
        }

        // 토큰 재발급
        const { accessToken, refreshToken } = await this.jwtClientService.createTokens(payload);

        // 리프레시 토큰 - 레디스 갱신
        await this.redisClientService.set(`refresh:${payload.sub}`, refreshToken, 60 * 60 * 24 * 7); // 토큰 만료 시간과 동일하게 7일

        return { accessToken, refreshToken };
    }
}
