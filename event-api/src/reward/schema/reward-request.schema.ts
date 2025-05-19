import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { RewardRequestStatusEnum } from '../enum/reward-request-status.enum';

export type RewardRequestDocument = HydratedDocument<RewardRequest>;

@Schema({ timestamps: { createdAt: true }, versionKey: false })
export class RewardRequest {
    @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Event' })
    eventId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Reward' })
    rewardId: Types.ObjectId;

    @Prop({ type: String, enum: RewardRequestStatusEnum, default: RewardRequestStatusEnum.FAILED })
    status: RewardRequestStatusEnum;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);

// 복합 유니크 인덱스 (중복 요청 방지) - 유저별 이벤트 당 1회 보상 요청가능
RewardRequestSchema.index({ userId: 1, eventId: 1 }, { unique: true });
