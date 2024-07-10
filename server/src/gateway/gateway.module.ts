import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GatewayManager } from './gateway.manager';
import { Gateway } from './gateway';

@Module({
    imports: [UserModule, ConfigModule, JwtModule],
    providers: [Gateway, GatewayManager],
})
export class GatewayModule {}