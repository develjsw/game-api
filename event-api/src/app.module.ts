import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseClientModule } from './common/mongoose/mongoose-client.module';
import { EventModule } from './event/event.module';
import { RewardModule } from './reward/reward.module';
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
        EventModule,
        RewardModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
