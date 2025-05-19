import { PagingDto } from '../../common/util/paging/dto/paging.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { RewardRequestStatusEnum } from '../enum/reward-request-status.enum';

export class GetRewardRequestListDto extends PagingDto {
    @IsOptional()
    @IsEnum(RewardRequestStatusEnum)
    status: RewardRequestStatusEnum;
}
