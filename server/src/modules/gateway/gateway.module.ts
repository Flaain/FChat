import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GatewayManager } from './gateway.manager';
import { GatewayService } from './gateway.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule, ConfigModule, JwtModule],
    providers: [GatewayService, GatewayManager],
})
export class GatewayModule {}