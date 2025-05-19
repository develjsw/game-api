import { Body, Controller, Get, Post, Query, Headers } from '@nestjs/common';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { RewardService } from '../service/reward.service';
import { RewardDocument } from '../schema/reward.schema';
import { CreateRewardRequestDto } from '../dto/create-reward-request.dto';
import { RewardRequestService } from '../service/reward-request.service';
import { RewardRequestDocument } from '../schema/reward-request.schema';
import { GetUserRewardRequestListDto } from '../dto/get-user-reward-request-list.dto';
import { ResponsePagingType } from '../../common/util/paging/type/paging.type';
import { GetRewardRequestListDto } from '../dto/get-reward-request-list.dto';

@Controller('rewards')
export class RewardController {
    constructor(
        private readonly rewardService: RewardService,
        private readonly rewardRequestService: RewardRequestService
    ) {}

    // 보상 정의 (이벤트에 보상 등록)
    @Post()
    async createReward(@Body() dto: CreateRewardDto): Promise<void> {
        await this.rewardService.createReward(dto);
    }

    // 보상 목록 조회 (해당 이벤트 보상 리스트 조회)
    @Get()
    async getRewardListByEventId(@Query('eventId') eventId: string): Promise<RewardDocument[]> {
        return await this.rewardService.getRewardListByEventId(eventId);
    }

    // 보상 요청 (유저가 보상 신청)
    @Post('user-requests')
    async createRewardRequest(
        @Headers('x-user-id') userId: string,
        @Body() dto: CreateRewardRequestDto
    ): Promise<void> {
        await this.rewardRequestService.createRewardRequest(userId, dto);
    }

    // 내 요청 조회 (유저의 요청 이력)
    @Get('user-requests/mine')
    async getUserRewardRequestListWithPaging(
        @Headers('x-user-id') userId: string,
        @Query() dto: GetUserRewardRequestListDto
    ): Promise<ResponsePagingType<RewardRequestDocument>> {
        return await this.rewardRequestService.getUserRewardRequestListWithPaging(userId, dto);
    }

    // 전체 요청 조회 (모든 보상 요청 목록)
    @Get('user-requests')
    async getAllRewardRequestListWithPagingByConditions(
        @Query() dto: GetRewardRequestListDto
    ): Promise<ResponsePagingType<RewardRequestDocument>> {
        return await this.rewardRequestService.getAllRewardRequestListWithPagingByConditions(dto);
    }

    // TODO : OPERATOR, ADMIN만 가능 (gateway api에서 막기)
    // 상태 변경 (보상 상태 처리(PENDING → COMPLETED 등))
}
