import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { YesNoEnum } from '../../common/enum/yes-no-enum';
import { EventConditionTypeEnum } from '../enum/event-condition-type.enum';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true, versionKey: false })
export class Event {
    @Prop({ required: true, index: -1 }) // 인덱스 설정 (내림차순)
    title: string;

    @Prop({ required: true, enum: EventConditionTypeEnum })
    conditionType: EventConditionTypeEnum;

    @Prop({ required: true })
    conditionValue: number; // 예: 로그인 3일, 친구 초대 1명

    @Prop({ required: true })
    startAt: Date;

    @Prop({ required: true })
    endAt: Date;

    @Prop({ default: YesNoEnum.NO })
    isActiveYn: YesNoEnum;
}

export const EventSchema = SchemaFactory.createForClass(Event);
