import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { GatewayModule } from './gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports: [
        AuthModule,
        UserModule,
        ConfigModule.forRoot(),
        EventEmitterModule.forRoot(),
        MongooseModule.forRoot(process.env.DATABASE_URI, { retryWrites: true }),
        ThrottlerModule.forRoot([{ limit: 5, ttl: 10000 }]),
        ConversationModule,
        MessageModule,
        GatewayModule,
    ],
    providers: [{ provide: 'APP_GUARD', useClass: ThrottlerGuard }],
})
export class AppModule {}