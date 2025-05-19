import { isValidObjectId, Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export function toObjectId(id: string): Types.ObjectId {
    if (!isValidObjectId(id)) throw new BadRequestException('유효하지 않은 ID 값 입니다.');

    return new Types.ObjectId(id);
}
