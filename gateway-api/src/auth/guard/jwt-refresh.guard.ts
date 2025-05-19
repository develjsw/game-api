import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// jwt-refresh-strategy 에서 설정한 jwt-refresh 키워드로 자동 매칭
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
