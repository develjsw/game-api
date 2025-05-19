import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateRewardRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    rewardId: string;
}
