import { Injectable } from '@nestjs/common';

@Injectable()
export class InviteFriendStrategy {
    evaluate(userId: string, requiredCount: number): boolean {
        return this.getInvitedFriendCount(userId) >= requiredCount;
    }

    private getInvitedFriendCount(userId: string): number {
        return 1;
    }
}
