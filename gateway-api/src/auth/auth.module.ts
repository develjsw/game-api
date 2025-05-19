import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './guard/roles.guard';
import { JwtAccessStrategy } from './strategy/jwt-access-strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh-strategy';
import { JwtAccessGuard } from './guard/jwt-access.guard';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';

@Module({
    imports: [PassportModule],
    providers: [JwtAccessStrategy, JwtRefreshStrategy, JwtAccessGuard, JwtRefreshGuard, RolesGuard],
    exports: []
})
export class AuthModule {}
