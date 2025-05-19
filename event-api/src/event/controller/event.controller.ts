import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventService } from '../service/event.service';
import { EventDocument } from '../schema/event.schema';
import { GetEventListDto } from '../dto/get-event-list.dto';
import { ResponsePagingType } from '../../common/util/paging/type/paging.type';

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    async createEvent(@Body() dto: CreateEventDto): Promise<void> {
        await this.eventService.createEvent(dto);
    }

    @Get()
    async getEventList(@Query() dto: GetEventListDto): Promise<ResponsePagingType<EventDocument>> {
        return await this.eventService.findEventListWithPagingByConditions(dto);
    }

    @Get(':eventId')
    async getEvent(@Param('eventId') eventId: string): Promise<EventDocument> {
        return await this.eventService.findEventById(eventId);
    }
}
