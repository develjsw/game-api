import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserRoleEnum } from '../enum/user-role.enum';
import { RequestWithUserInterface } from '../interface/request-with-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // roles meta 정보 읽어옴
        const requiredRoles: UserRoleEnum[] = this.reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        // roles 정보 없는 경우 pass
        if (!requiredRoles) {
            return true;
        }

        // 토큰에서 Request 객체로 저장했던 user 정보의 role 값과 매칭되는 역할값 검증
        const { user } = context.switchToHttp().getRequest<RequestWithUserInterface>();
        if (!user) {
            throw new UnauthorizedException('인증되지 않은 사용자입니다.');
        }

        if (!user.role) {
            throw new ForbiddenException('역할 정보가 없습니다.');
        }

        // 역할 비교 검증
        return requiredRoles.includes(user.role);
    }
}
