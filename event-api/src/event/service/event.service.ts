import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EVENT_REPOSITORY_INTERFACE, EventRepositoryInterface } from '../interface/event-repository.interface';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventDocument } from '../schema/event.schema';
import { GetEventListDto } from '../dto/get-event-list.dto';
import { calculatePaging } from '../../common/util/paging/paging.util';
import { ResponsePagingType } from '../../common/util/paging/type/paging.type';

@Injectable()
export class EventService {
    constructor(
        @Inject(EVENT_REPOSITORY_INTERFACE)
        private readonly eventRepository: EventRepositoryInterface
    ) {}

    async createEvent(dto: CreateEventDto): Promise<void> {
        await this.eventRepository.createEvent(dto);
    }

    async findEventById(id: string): Promise<EventDocument> {
        const findEventResult: EventDocument | null = await this.eventRepository.findEventById(id);
        if (!findEventResult) {
            throw new NotFoundException('일치하는 이벤트가 없습니다.');
        }

        return findEventResult;
    }

    async findEventListWithPagingByConditions(dto: GetEventListDto): Promise<ResponsePagingType<EventDocument>> {
        const { page, perPage, ...rest } = dto;

        const { skip, limit } = calculatePaging(page, perPage);

        const { totalCount, list } = await this.eventRepository.findEventListWithPagingByConditions(skip, limit, rest);
        if (!totalCount) {
            throw new NotFoundException('데이터가 존재하지 않습니다.');
        }

        return {
            paging: {
                page,
                perPage,
                totalCount
            },
            list
        };
    }
}
