import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
    imports: [ConversationModule, MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
    providers: [MessageService],
    controllers: [MessageController],
})
export class MessageModule {}