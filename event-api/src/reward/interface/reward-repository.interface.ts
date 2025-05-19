import { Reward, RewardDocument } from '../schema/reward.schema';

export const REWARD_REPOSITORY_INTERFACE = 'RewardRepositoryInterface';

export interface RewardRepositoryInterface {
    createReward(data: Partial<Reward>): Promise<RewardDocument>;

    findRewardListByEventId(eventId: string): Promise<RewardDocument[]>;
    findRewardByEventId(eventId: string): Promise<RewardDocument | null>;
    findRewardById(id: string): Promise<RewardDocument | null>;

    existsRewardById(id: string): Promise<boolean>;
}
