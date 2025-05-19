import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import * as dayjs from 'dayjs';
import { EventConditionTypeEnum } from '../enum/event-condition-type.enum';

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsEnum(EventConditionTypeEnum)
    conditionType: EventConditionTypeEnum;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    conditionValue: number;

    // TODO : 날짜 타입 유효성 검증과 타입 변환 재확인 필요
    @IsNotEmpty()
    @Transform(({ value }: { value: string }) => dayjs(value, 'YYYY-MM-DD HH:mm:ss').toDate())
    @IsDate()
    startAt: Date;

    @IsNotEmpty()
    @Transform(({ value }: { value: string }) => dayjs(value, 'YYYY-MM-DD HH:mm:ss').toDate())
    @IsDate()
    endAt: Date;
}
