import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ProxyService } from '../../service/proxy.service';
import { Request, Response } from 'express';
import { JwtAccessGuard } from '../../../auth/guard/jwt-access.guard';
import { RolesGuard } from '../../../auth/guard/roles.guard';
import { Roles } from '../../../auth/decorator/roles.decorator';
import { UserRoleEnum } from '../../../auth/enum/user-role.enum';

@Controller('events')
export class EventApiProxyController {
    constructor(private readonly proxyService: ProxyService) {}

    // 이벤트 생성 (운영자 또는 관리자만)
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR)
    @Post()
    async proxyCreateEvent(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }

    // 이벤트 목록 조회 (누구나)
    @Get()
    async proxyGetEventList(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }

    // 이벤트 상세 조회 (누구나)
    @Get(':eventId')
    async getProxyGetEventList(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }
}
