import { Event, EventDocument } from '../schema/event.schema';

export const EVENT_REPOSITORY_INTERFACE = 'EventRepositoryInterface';

export interface EventRepositoryInterface {
    createEvent(data: Partial<Event>): Promise<EventDocument>;

    findEventById(id: string): Promise<EventDocument | null>;
    findEventListWithPagingByConditions(
        skip: number,
        limit: number,
        data?: Partial<Event>
    ): Promise<{ totalCount: number; list: EventDocument[] }>;

    existsEventById(id: string): Promise<boolean>;
}
