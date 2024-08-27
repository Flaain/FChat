import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { ConversationModule } from '../conversation/conversation.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [ConversationModule, UserModule, MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
    providers: [MessageService],
    controllers: [MessageController],
    exports: [MessageService],
})
export class MessageModule {}