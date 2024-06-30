import { Module } from '@nestjs/common';
import { MessageGateway } from './websocket.gateway';
import { UserModule } from 'src/user/user.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UserModule, ConversationModule, ConfigModule, JwtModule],
    providers: [MessageGateway],
})
export class GatewayModule {}