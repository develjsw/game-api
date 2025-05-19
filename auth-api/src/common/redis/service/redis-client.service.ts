import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisClientService {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async set(key: string, value: string, ttl: number): Promise<void> {
        await this.redis.set(key, value, 'EX', ttl); // EX: 초 단위
    }

    async get(key: string): Promise<string | null> {
        return this.redis.get(key);
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }
}
