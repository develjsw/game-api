import { IsEnum, IsInt, IsMongoId, IsNotEmpty, IsString, Min } from 'class-validator';
import { RewardTypeEnum } from '../enum/reward-type.enum';

export class CreateRewardDto {
    @IsNotEmpty()
    @IsMongoId()
    eventId: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(RewardTypeEnum)
    type: RewardTypeEnum;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;
}
