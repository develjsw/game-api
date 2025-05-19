import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PagingDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    page: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(50) // 과도하게 많은 데이터 호출 불가능
    perPage: number;
}
