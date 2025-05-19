import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginDaysStrategy {
    evaluate(userId: string, requiredDays: number): boolean {
        const loginDates: Date[] = this.getUserLoginDates(userId);
        const uniqueDays = new Set(loginDates.map((date: Date): string => date.toISOString().slice(0, 10)));
        return uniqueDays.size >= requiredDays;
    }

    private getUserLoginDates(userId: string): Date[] {
        return [new Date('2025-05-17'), new Date('2025-05-18'), new Date('2025-05-19')];
    }
}
