import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from '../schema/reward.schema';
import { RewardRepositoryInterface } from '../interface/reward-repository.interface';
import { toObjectId } from '../../common/util/convert/object-id';

@Injectable()
export class RewardRepository implements RewardRepositoryInterface {
    constructor(@InjectModel(Reward.name) private readonly rewardModel: Model<RewardDocument>) {}

    async createReward(data: Partial<Reward>): Promise<RewardDocument> {
        return await this.rewardModel.create(data);
    }

    async findRewardListByEventId(eventId: string): Promise<RewardDocument[]> {
        return await this.rewardModel.find({ eventId: toObjectId(eventId) }).exec();
    }

    async findRewardByEventId(eventId: string): Promise<RewardDocument | null> {
        return await this.rewardModel.findOne({ eventId: toObjectId(eventId) }).exec();
    }

    async findRewardById(id: string): Promise<RewardDocument | null> {
        return await this.rewardModel.findById(id).exec();
    }

    async existsRewardById(id: string): Promise<boolean> {
        return !!(await this.rewardModel.exists({ _id: id }).exec());
    }
}
