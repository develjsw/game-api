import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// jwt-access-strategy 에서 설정한 jwt-access 키워드로 자동 매칭
@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {}
