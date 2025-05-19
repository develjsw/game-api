import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ProxyService } from '../../service/proxy.service';
import { Request, Response } from 'express';
import { JwtAccessGuard } from '../../../auth/guard/jwt-access.guard';
import { RolesGuard } from '../../../auth/guard/roles.guard';
import { Roles } from '../../../auth/decorator/roles.decorator';
import { UserRoleEnum } from '../../../auth/enum/user-role.enum';

@Controller('rewards')
export class EventRewardApiProxyController {
    constructor(private readonly proxyService: ProxyService) {}

    // 보상 정의 (이벤트에 보상 등록 - 운영자, 관리자만 가능)
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR)
    @Post()
    async proxyCreateReward(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }

    // (회원) 보상 목록 조회 (해당 이벤트 보상 리스트 조회 - 운영자, 관리자만 가능)
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR)
    @Get()
    async proxyGetRewardListByEventId(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }

    // 보상 요청 (유저가 보상 신청 - 유저만 가능)
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(UserRoleEnum.USER)
    @Post('user-requests')
    async proxyCreateRewardRequest(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }

    // 내 요청 조회 (유저의 요청 이력 - 유저만 가능)
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(UserRoleEnum.USER)
    @Get('user-requests/mine')
    async proxyGetUserRewardRequestListWithPaging(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }

    // 전체 요청 조회 (모든 보상 요청 목록 - 운영자, 관리자, 감시자만 가능)
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(UserRoleEnum.OPERATOR, UserRoleEnum.ADMIN, UserRoleEnum.AUDITOR)
    @Get('user-requests')
    async proxyGetAllRewardRequestListWithPagingByConditions(@Req() req: Request, @Res() res: Response) {
        return await this.proxyService.forward(req, res);
    }
}
