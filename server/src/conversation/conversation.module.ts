import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserModule } from 'src/user/user.module';
import { ParticipantModule } from 'src/participant/participant.module';

@Module({
    imports: [
        UserModule,
        ParticipantModule,
        MongooseModule.forFeature([
            { name: Conversation.name, schema: ConversationSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    providers: [ConversationService],
    controllers: [ConversationController],
    exports: [ConversationService],
})
export class ConversationModule {}