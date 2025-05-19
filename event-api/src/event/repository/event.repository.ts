import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from '../schema/event.schema';
import { isValidObjectId, Model } from 'mongoose';
import { EventRepositoryInterface } from '../interface/event-repository.interface';
import { toObjectId } from '../../common/util/convert/object-id';

@Injectable()
export class EventRepository implements EventRepositoryInterface {
    constructor(@InjectModel(Event.name) private readonly eventModel: Model<EventDocument>) {}

    async createEvent(data: Partial<Event>): Promise<EventDocument> {
        return await this.eventModel.create(data);
    }

    async findEventById(id: string): Promise<EventDocument | null> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('유효하지 않은 eventId 값 입니다.');
        }

        return this.eventModel.findById(id).exec();
    }

    async findEventListWithPagingByConditions(
        skip: number,
        limit: number,
        data?: Partial<Pick<Event, 'title' | 'isActiveYn' | 'startAt' | 'endAt'>>
    ): Promise<{ totalCount: number; list: EventDocument[] }> {
        const { title, isActiveYn, startAt, endAt } = data || {};

        const where = {
            ...(isActiveYn && { isActiveYn }),
            ...(title && { title: { $regex: title, $options: 'i' } }), // 부분 문자열 검색, 대소문자 구분 없이
            ...(startAt && { startAt: { $gte: startAt } }),
            ...(endAt && { endAt: { $lte: endAt } })
        };

        const [totalCount, list] = await Promise.all([
            this.eventModel.countDocuments(where).exec(),
            this.eventModel.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit).exec()
        ]);

        return {
            totalCount,
            list
        };
    }

    async existsEventById(id: string): Promise<boolean> {
        return !!(await this.eventModel.exists({ _id: id }).exec());
    }
}
