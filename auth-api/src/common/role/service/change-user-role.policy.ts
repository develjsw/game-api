import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRoleEnum } from '../enum/user-role.enum';

@Injectable()
export class ChangeUserRolePolicy {
    constructor(private readonly configService: ConfigService) {}

    getHashedCodeByRole(role: UserRoleEnum): string {
        let envKey: string;

        switch (role) {
            case UserRoleEnum.ADMIN:
                envKey = 'ADMIN_ROLE_CODE_HASH';
                break;
            case UserRoleEnum.OPERATOR:
                envKey = 'OPERATOR_ROLE_CODE_HASH';
                break;
            case UserRoleEnum.AUDITOR:
                envKey = 'AUDITOR_ROLE_CODE_HASH';
                break;
            default:
                throw new BadRequestException('권한을 변경하실 수 없습니다.');
        }

        const hashedCode = this.configService.get<string>(envKey);

        if (!hashedCode) {
            throw new BadRequestException(`환경변수 ${envKey}가 설정되지 않았습니다.`);
        }

        return hashedCode;
    }
}
