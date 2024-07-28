import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GatewayManager } from './gateway.manager';
import { GatewayService } from './gateway.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule, JwtModule],
    providers: [GatewayService, GatewayManager],
})
export class GatewayModule {}