import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    REWARD_REQUEST_REPOSITORY_INTERFACE,
    RewardRequestRepositoryInterface
} from '../interface/reward-request-repository.interface';
import { CreateRewardRequestDto } from '../dto/create-reward-request.dto';
import { RewardDocument } from '../schema/reward.schema';
import { REWARD_REPOSITORY_INTERFACE, RewardRepositoryInterface } from '../interface/reward-repository.interface';
import { EVENT_REPOSITORY_INTERFACE, EventRepositoryInterface } from '../../event/interface/event-repository.interface';
import { EventDocument } from '../../event/schema/event.schema';
import { RewardRequestStatusEnum } from '../enum/reward-request-status.enum';
import { PolicyFactory } from '../policy/policy-factory';
import { LoginDaysStrategy } from '../policy/strategy/login-days.strategy';
import { InviteFriendStrategy } from '../policy/strategy/invite-friend.strategy';
import { RewardRequestDocument } from '../schema/reward-request.schema';
import { GetUserRewardRequestListDto } from '../dto/get-user-reward-request-list.dto';
import { calculatePaging } from '../../common/util/paging/paging.util';
import { ResponsePagingType } from '../../common/util/paging/type/paging.type';
import { GetRewardRequestListDto } from '../dto/get-reward-request-list.dto';

@Injectable()
export class RewardRequestService {
    constructor(
        @Inject(REWARD_REPOSITORY_INTERFACE)
        private readonly rewardRepository: RewardRepositoryInterface,

        @Inject(EVENT_REPOSITORY_INTERFACE)
        private readonly eventRepository: EventRepositoryInterface,

        @Inject(REWARD_REQUEST_REPOSITORY_INTERFACE)
        private readonly rewardRequestRepository: RewardRequestRepositoryInterface,

        private readonly policyFactory: PolicyFactory
    ) {}

    async createRewardRequest(userId: string, dto: CreateRewardRequestDto): Promise<void> {
        const { rewardId } = dto;

        const findRewardResult: RewardDocument | null = await this.rewardRepository.findRewardById(rewardId);
        if (!findRewardResult) {
            throw new NotFoundException('보상이 존재하지 않습니다');
        }

        const findEventResult: EventDocument | null = await this.eventRepository.findEventById(
            String(findRewardResult.eventId)
        );
        if (!findEventResult) {
            throw new NotFoundException('이벤트가 존재하지 않습니다');
        }

        const isAlreadyRequested: boolean = await this.rewardRequestRepository.existsByUserAndEvent(
            userId,
            String(findEventResult._id)
        );
        if (isAlreadyRequested) {
            throw new ConflictException('이미 보상을 요청하였습니다');
        }

        const policy: LoginDaysStrategy | InviteFriendStrategy = this.policyFactory.getPolicy(
            findEventResult.conditionType
        );
        const isEligible: boolean = policy.evaluate(userId, findEventResult.conditionValue);

        await this.rewardRequestRepository.createRequest({
            userId,
            rewardId: String(findRewardResult._id),
            eventId: String(findEventResult._id),
            isSuccess: isEligible,
            status: isEligible ? RewardRequestStatusEnum.SUCCESS : RewardRequestStatusEnum.FAILED
        });
    }

    async getUserRewardRequestListWithPaging(
        userId: string,
        dto: GetUserRewardRequestListDto
    ): Promise<ResponsePagingType<RewardRequestDocument>> {
        const { page, perPage } = dto;

        const { skip, limit } = calculatePaging(page, perPage);

        const { totalCount, list } = await this.rewardRequestRepository.findRewardRequestListWithPagingByUserId(
            userId,
            skip,
            limit
        );
        if (!totalCount) {
            throw new NotFoundException('데이터가 존재하지 않습니다.');
        }

        return {
            paging: {
                page,
                perPage,
                totalCount
            },
            list
        };
    }

    async getAllRewardRequestListWithPagingByConditions(
        dto: GetRewardRequestListDto
    ): Promise<ResponsePagingType<RewardRequestDocument>> {
        const { page, perPage, ...rest } = dto;

        const { skip, limit } = calculatePaging(page, perPage);

        const { totalCount, list } = await this.rewardRequestRepository.findRewardRequestListWithPagingByConditions(
            skip,
            limit,
            rest
        );
        if (!totalCount) {
            throw new NotFoundException('데이터가 존재하지 않습니다.');
        }

        return {
            paging: {
                page,
                perPage,
                totalCount
            },
            list
        };
    }
}
