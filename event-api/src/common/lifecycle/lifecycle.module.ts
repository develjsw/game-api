import { Module } from '@nestjs/common';
import { ShutdownHandler } from './shutdown.handler';

@Module({
    providers: [ShutdownHandler],
    exports: [ShutdownHandler]
})
export class LifecycleModule {}
