import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class ShutdownHandler implements OnApplicationShutdown {
    private isSend = false;
    private readonly listener: Subject<void> = new Subject<void>();

    onApplicationShutdown(): void {
        if (!this.isSend) {
            this.isSend = true;
            this.shutdown();
        }
    }

    subscribeToShutdown(shutdownFn: () => void): void {
        this.listener.subscribe(() => shutdownFn());
    }

    shutdown(): void {
        this.listener.next();
        this.listener.complete();
    }
}
