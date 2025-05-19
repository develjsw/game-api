import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisClientModule } from './common/redis/redis-client.module';
import { JwtClientModule } from './common/jwt/jwt-client.module';
import { RoleModule } from './common/role/role.module';
import { MongooseClientModule } from './common/mongoose/mongoose-client.module';
import { LifecycleModule } from './common/lifecycle/lifecycle.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.NODE_ENV || 'local'}`],
            isGlobal: true,
            cache: true
        }),
        LifecycleModule,
        MongooseClientModule,
        JwtClientModule,
        RedisClientModule,
        UserModule,
        AuthModule,
        RoleModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
