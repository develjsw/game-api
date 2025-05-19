import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRoleEnum } from '../../common/role/enum/user-role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    // 비밀번호 디폴트 숨김처리
    @Prop({ required: true, select: false })
    password: string;

    @Prop({ default: UserRoleEnum.USER })
    role: UserRoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
