import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from '../schema/reward-request.schema';
import { RewardRequestRepositoryInterface } from '../interface/reward-request-repository.interface';
import { toObjectId } from '../../common/util/convert/object-id';
import { RewardRequestStatusEnum } from '../enum/reward-request-status.enum';

export class RewardRequestRepository implements RewardRequestRepositoryInterface {
    constructor(
        @InjectModel(RewardRequest.name)
        private readonly rewardRequestModel: Model<RewardRequestDocument>
    ) {}

    async createRequest(data: {
        userId: string;
        eventId: string;
        rewardId: string;
        isSuccess: boolean;
        status: RewardRequestStatusEnum;
    }): Promise<void> {
        await this.rewardRequestModel.create({
            userId: toObjectId(data.userId),
            eventId: toObjectId(data.eventId),
            rewardId: toObjectId(data.rewardId),
            isSuccess: data.isSuccess,
            status: data.status
        });
    }

    async existsByUserAndEvent(userId: string, eventId: string): Promise<boolean> {
        return !!(await this.rewardRequestModel
            .exists({ userId: toObjectId(userId), eventId: toObjectId(eventId) })
            .exec());
    }

    async findRewardRequestListWithPagingByUserId(
        userId: string,
        skip: number,
        limit: number
    ): Promise<{ totalCount: number; list: RewardRequestDocument[] }> {
        const [totalCount, list] = await Promise.all([
            this.rewardRequestModel.countDocuments({ userId: toObjectId(userId) }).exec(),
            this.rewardRequestModel
                .find({ userId: toObjectId(userId) })
                .populate('eventId')
                .populate('rewardId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec()
        ]);

        return {
            totalCount,
            list
        };
    }

    async findRewardRequestListWithPagingByConditions(
        skip: number,
        limit: number,
        data?: Partial<RewardRequest>
    ): Promise<{ totalCount: number; list: RewardRequestDocument[] }> {
        const { status } = data || {};

        const where = {
            ...(status && { status })
        };

        const [totalCount, list] = await Promise.all([
            this.rewardRequestModel.countDocuments(where).exec(),
            this.rewardRequestModel
                .find(where)
                .populate('eventId')
                .populate('rewardId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec()
        ]);

        return {
            totalCount,
            list
        };
    }
}
