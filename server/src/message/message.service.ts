import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model, Types } from 'mongoose';
import { MessageSendDTO } from './dtos/message.send.dto';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<Message>,
        private readonly conversationService: ConversationService,
    ) {}

    send = async ({
        conversationId,
        message,
        initiatorId,
    }: MessageSendDTO & { conversationId: string; initiatorId: Types.ObjectId }) => {
        try {
            const conversation = await this.conversationService.findOneByPayload({
                _id: conversationId,
                participants: { $in: [initiatorId] },
            });

            if (!conversation) throw new HttpException({ message: 'Conversation not found' }, HttpStatus.NOT_FOUND);

            const newMessage = new this.messageModel({
                sender: initiatorId,
                text: message,
            });

            conversation.messages.push(newMessage._id);

            const [savedMessage] = await Promise.all([newMessage.save(), conversation.save()]);
            const populatedMessage = await savedMessage.populate([
                { path: 'sender', model: 'User', select: 'name email' },
            ]);

            return populatedMessage;
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    };
}