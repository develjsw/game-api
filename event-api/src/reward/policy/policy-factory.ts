import { Injectable } from '@nestjs/common';
import { LoginDaysStrategy } from './strategy/login-days.strategy';
import { InviteFriendStrategy } from './strategy/invite-friend.strategy';
import { EventConditionTypeEnum } from '../../event/enum/event-condition-type.enum';

@Injectable()
export class PolicyFactory {
    constructor(
        private readonly loginDays: LoginDaysStrategy,
        private readonly inviteFriend: InviteFriendStrategy
    ) {}

    getPolicy(type: EventConditionTypeEnum): LoginDaysStrategy | InviteFriendStrategy {
        switch (type) {
            case EventConditionTypeEnum.LOGIN_DAYS:
                return this.loginDays;
            case EventConditionTypeEnum.INVITE_FRIEND:
                return this.inviteFriend;
            default:
                throw new Error('지원하지 않는 조건 타입입니다');
        }
    }
}
