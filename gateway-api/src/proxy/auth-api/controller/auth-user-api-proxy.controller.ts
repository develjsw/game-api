import { Controller, Post, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { ProxyService } from '../../service/proxy.service';
import { Request, Response } from 'express';
import { JwtAccessGuard } from '../../../auth/guard/jwt-access.guard';

@Controller('auth/users')
export class AuthUserApiProxyController {
    constructor(private readonly proxyService: ProxyService) {}

    // 기본 유저 등록 (누구나)
    @Post()
    async proxyRegisterUser(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }

    // 유저 역할 변경 (권한 변경, 정상 엑세스 토큰 보유자만)
    @UseGuards(JwtAccessGuard)
    @Patch('role')
    async proxyChangeUserRole(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }
}
