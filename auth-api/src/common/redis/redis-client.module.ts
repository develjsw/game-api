import { Global, Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis/dist/redis.module';
import { ConfigService } from '@nestjs/config';
import { RedisClientService } from './service/redis-client.service';

@Global()
@Module({
    imports: [
        RedisModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                url: configService.get<string>('REDIS_URI'),
                type: 'single'
            }),
            inject: [ConfigService]
        })
    ],
    providers: [RedisClientService],
    exports: [RedisClientService]
})
export class RedisClientModule {}
