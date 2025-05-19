import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RewardHistoryDocument = HydratedDocument<RewardHistory>;

@Schema({ timestamps: true, versionKey: false })
export class RewardHistory {
    @Prop({ required: true })
    userId: string;

    @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
    eventId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Reward', required: true })
    rewardId: Types.ObjectId;

    @Prop({ default: Date.now })
    rewardedAt: Date;
}

export const RewardHistorySchema = SchemaFactory.createForClass(RewardHistory);
