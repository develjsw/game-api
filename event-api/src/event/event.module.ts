import { Module } from '@nestjs/common';
import { EventController } from './controller/event.controller';
import { EventService } from './service/event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schema/event.schema';
import { UserEvent, UserEventSchema } from './schema/user-event.schema';
import { EVENT_REPOSITORY_INTERFACE } from './interface/event-repository.interface';
import { EventRepository } from './repository/event.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Event.name, schema: EventSchema },
            { name: UserEvent.name, schema: UserEventSchema }
        ])
    ],
    controllers: [EventController],
    providers: [
        EventService,
        {
            provide: EVENT_REPOSITORY_INTERFACE,
            useClass: EventRepository
        }
    ],
    exports: [EVENT_REPOSITORY_INTERFACE]
})
export class EventModule {}
