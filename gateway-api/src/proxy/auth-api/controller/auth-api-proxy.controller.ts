import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ProxyService } from '../../service/proxy.service';
import { Request, Response } from 'express';
import { JwtRefreshGuard } from '../../../auth/guard/jwt-refresh.guard';

@Controller('auth')
export class AuthApiProxyController {
    constructor(private readonly proxyService: ProxyService) {}

    // 로그인 (누구나)
    @Post('login')
    async proxyLogin(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }

    // 토큰 갱신 (정상 리프레시 토큰 보유자만)
    @UseGuards(JwtRefreshGuard)
    @Post('token/renew')
    async proxyTokenRenew(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }
}
