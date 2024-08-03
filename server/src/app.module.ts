import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { MessageModule } from './modules/message/message.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { ParticipantModule } from './modules/participant/participant.module';
import { GroupModule } from './modules/group/group.module';
import { GroupMessageModule } from './modules/group-message/group-message.module';
import { SessionModule } from './modules/session/session.module';
import { OtpModule } from './modules/otp/otp.module';
import { FeedModule } from './modules/feed/feed.module';
import { UAParserModule } from './utils/uaparser/uaparser.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        FeedModule,
        UAParserModule.forRoot(),
        ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
        MongooseModule.forRoot(process.env.DATABASE_URI, { retryWrites: true }),
        ThrottlerModule.forRoot([{ limit: 5, ttl: 10000 }]),
        EventEmitterModule.forRoot(),
        ConversationModule,
        MessageModule,
        GatewayModule,
        ParticipantModule,
        GroupModule,
        GroupMessageModule,
        SessionModule,
        OtpModule,
    ],
    providers: [{ provide: 'APP_GUARD', useClass: ThrottlerGuard }],
})
export class AppModule {}