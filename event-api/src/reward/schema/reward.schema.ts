import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RewardTypeEnum } from '../enum/reward-type.enum';

export type RewardDocument = HydratedDocument<Reward>;

@Schema({ timestamps: true, versionKey: false })
export class Reward {
    @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
    eventId: Types.ObjectId; // 이벤트 ID (Event._id)

    @Prop({ required: true })
    name: string; // 보상 명칭 - EX) 레드큐브, 10000

    @Prop({ required: true, enum: RewardTypeEnum })
    type: RewardTypeEnum; // 보상 종류 - EX) ITEM, CASH, COUPON

    @Prop({ required: true })
    quantity: number; // 수량
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

// 이벤트 1개에 보상은 1개만 설정 가능하도록 제한
RewardSchema.index({ eventId: 1 }, { unique: true });
