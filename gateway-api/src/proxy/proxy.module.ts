import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyService } from './service/proxy.service';
import { AuthApiProxyController } from './auth-api/controller/auth-api-proxy.controller';
import { EventApiProxyController } from './event-api/controller/event-api-proxy.controller';
import { AuthUserApiProxyController } from './auth-api/controller/auth-user-api-proxy.controller';
import { EventRewardApiProxyController } from './event-api/controller/event-reward-api-proxy.controller';

@Module({
    imports: [HttpModule],
    controllers: [
        AuthApiProxyController,
        AuthUserApiProxyController,
        EventApiProxyController,
        EventRewardApiProxyController
    ],
    providers: [ProxyService],
    exports: []
})
export class ProxyModule {}
