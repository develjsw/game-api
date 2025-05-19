import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: []
})
export class AuthModule {}
