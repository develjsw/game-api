import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserEventDocument = HydratedDocument<UserEvent>;

@Schema({ timestamps: true, versionKey: false })
export class UserEvent {
    @Prop({ required: true })
    userId: string; // JWT 기반으로 전달받는 유저 ID

    @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
    eventId: Types.ObjectId;

    @Prop({ default: Date.now })
    participatedAt: Date;
}

export const UserEventSchema = SchemaFactory.createForClass(UserEvent);
