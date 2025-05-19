import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
    intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<{ data: T } | { message: string }> {
        return next.handle().pipe(
            map((data: T) => {
                if (data) {
                    return {
                        ...(data && { data })
                    };
                }
                return { message: 'success' };
            })
        );
    }
}
