import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { REWARD_REPOSITORY_INTERFACE, RewardRepositoryInterface } from '../interface/reward-repository.interface';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { EVENT_REPOSITORY_INTERFACE, EventRepositoryInterface } from '../../event/interface/event-repository.interface';
import { RewardDocument } from '../schema/reward.schema';
import { toObjectId } from '../../common/util/convert/object-id';

@Injectable()
export class RewardService {
    constructor(
        @Inject(REWARD_REPOSITORY_INTERFACE)
        private readonly rewardRepository: RewardRepositoryInterface,

        @Inject(EVENT_REPOSITORY_INTERFACE)
        private readonly eventRepository: EventRepositoryInterface
    ) {}

    async createReward(dto: CreateRewardDto): Promise<void> {
        const existsEventId: boolean = await this.eventRepository.existsEventById(dto.eventId);
        if (!existsEventId) {
            throw new BadRequestException('존재하지 않는 이벤트 ID 입니다.');
        }

        await this.rewardRepository.createReward({
            ...dto,
            eventId: toObjectId(dto.eventId)
        });
    }

    async getRewardListByEventId(eventId: string): Promise<RewardDocument[]> {
        const findRewardListResult: RewardDocument[] = await this.rewardRepository.findRewardListByEventId(eventId);
        if (!findRewardListResult.length) {
            throw new NotFoundException('데이터가 존재하지 않습니다.');
        }

        return findRewardListResult;
    }
}
