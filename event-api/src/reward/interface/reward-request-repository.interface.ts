import { RewardRequestStatusEnum } from '../enum/reward-request-status.enum';
import { RewardRequest, RewardRequestDocument } from '../schema/reward-request.schema';

export const REWARD_REQUEST_REPOSITORY_INTERFACE = 'RewardRequestRepositoryInterface';

export interface RewardRequestRepositoryInterface {
    createRequest(data: {
        userId: string;
        eventId: string;
        rewardId: string;
        isSuccess: boolean;
        status: RewardRequestStatusEnum;
    }): Promise<void>;

    existsByUserAndEvent(userId: string, eventId: string): Promise<boolean>;

    findRewardRequestListWithPagingByUserId(
        userId: string,
        skip: number,
        limit: number
    ): Promise<{ totalCount: number; list: RewardRequestDocument[] }>;

    findRewardRequestListWithPagingByConditions(
        skip: number,
        limit: number,
        data?: Partial<RewardRequest>
    ): Promise<{ totalCount: number; list: RewardRequestDocument[] }>;
}
