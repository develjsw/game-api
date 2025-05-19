import { Module } from '@nestjs/common';
import { RewardController } from './controller/reward.controller';
import { RewardService } from './service/reward.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './schema/reward.schema';
import { REWARD_REPOSITORY_INTERFACE } from './interface/reward-repository.interface';
import { RewardRepository } from './repository/reward.repository';
import { EventModule } from '../event/event.module';
import { RewardRequestRepository } from './repository/reward-request.repository';
import { REWARD_REQUEST_REPOSITORY_INTERFACE } from './interface/reward-request-repository.interface';
import { RewardRequest, RewardRequestSchema } from './schema/reward-request.schema';
import { RewardRequestService } from './service/reward-request.service';
import { PolicyFactory } from './policy/policy-factory';
import { InviteFriendStrategy } from './policy/strategy/invite-friend.strategy';
import { LoginDaysStrategy } from './policy/strategy/login-days.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Reward.name, schema: RewardSchema },
            { name: RewardRequest.name, schema: RewardRequestSchema }
        ]),
        EventModule // EVENT_REPOSITORY_INTERFACE 사용을 위해 Import, 이벤트와 보상은 상/하위 개념과 비슷하여 순환참조 발생 가능성 ↓
    ],
    controllers: [RewardController],
    providers: [
        RewardService,
        {
            provide: REWARD_REPOSITORY_INTERFACE,
            useClass: RewardRepository
        },
        RewardRequestService,
        {
            provide: REWARD_REQUEST_REPOSITORY_INTERFACE,
            useClass: RewardRequestRepository
        },
        PolicyFactory,
        InviteFriendStrategy,
        LoginDaysStrategy
    ],
    exports: [REWARD_REPOSITORY_INTERFACE, REWARD_REQUEST_REPOSITORY_INTERFACE]
})
export class RewardModule {}
