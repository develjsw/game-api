import { PagingInterface } from './interface/paging.interface';

export function calculatePaging(page: number = 1, perPage: number = 10): PagingInterface {
    const limit: number = perPage;
    const skip: number = (page - 1) * limit;

    return {
        page,
        perPage: limit,
        skip,
        limit
    };
}
