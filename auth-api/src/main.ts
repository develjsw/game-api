import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseFormatInterceptor } from './common/interceptor/response-format.interceptor';
import * as cookieParser from 'cookie-parser';
import { ShutdownHandler } from './common/lifecycle/shutdown.handler';

async function bootstrap(): Promise<void> {
    const app: INestApplication = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );

    app.use(cookieParser());

    app.enableShutdownHooks();

    app.get(ShutdownHandler).subscribeToShutdown(() => void app.close());

    app.useGlobalInterceptors(new ResponseFormatInterceptor());

    const configService: ConfigService = app.get(ConfigService);

    await app.listen(+configService.get('SERVER_PORT'));
}
bootstrap();
