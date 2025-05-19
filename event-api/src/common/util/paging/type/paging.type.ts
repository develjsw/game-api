export class ResponsePagingType<T> {
    paging: {
        page: number;
        perPage: number;
        totalCount: number;
    };
    list: T[];
}
