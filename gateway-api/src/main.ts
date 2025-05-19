import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShutdownHandler } from './common/lifecycle/shutdown.handler';

async function bootstrap(): Promise<void> {
    const app: INestApplication = await NestFactory.create(AppModule);

    app.enableShutdownHooks();

    app.get(ShutdownHandler).subscribeToShutdown(() => void app.close());

    const configService: ConfigService = app.get(ConfigService);

    await app.listen(+configService.get('SERVER_PORT'));
}
bootstrap();
