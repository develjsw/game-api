import { PagingDto } from '../../common/util/paging/dto/paging.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { YesNoEnum } from '../../common/enum/yes-no-enum';

export class GetEventListDto extends PagingDto {
    @IsOptional()
    @IsEnum(YesNoEnum)
    isActiveYn: YesNoEnum;

    @IsOptional()
    @IsString()
    title: string;
}
