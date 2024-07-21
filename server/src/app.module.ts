import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { GatewayModule } from './gateway/gateway.module';
import { ParticipantModule } from './participant/participant.module';
import { GroupModule } from './group/group.module';
import { GroupMessageModule } from './group-message/group-message.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SessionModule } from './session/session.module';
import { OtpModule } from './otp/otp.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        ConfigModule.forRoot(),
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