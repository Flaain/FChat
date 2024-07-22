import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GatewayManager } from './gateway.manager';
import { Gateway } from './gateway';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule, ConfigModule, JwtModule],
    providers: [Gateway, GatewayManager],
})
export class GatewayModule {}