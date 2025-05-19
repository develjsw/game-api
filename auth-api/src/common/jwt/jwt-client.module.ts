import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtClientService } from './service/jwt-client.service';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET')
            }),
            inject: [ConfigService]
        })
    ],
    providers: [JwtClientService],
    exports: [JwtClientService]
})
export class JwtClientModule {}
