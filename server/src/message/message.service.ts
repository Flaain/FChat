import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model, Types } from 'mongoose';
import { ConversationService } from 'src/conversation/conversation.service';
import { DeleteMessageType, IMessageService, MessageDocumentType, SendMessageType } from './types';

@Injectable()
export class MessageService implements IMessageService {
    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<Message>,
        private readonly conversationService: ConversationService,
    ) {}

    send = async ({ conversationId, message, initiatorId }: SendMessageType): Promise<MessageDocumentType> => {
        try {
            const conversation = await this.conversationService.findOneByPayload({
                _id: conversationId,
                participants: { $in: initiatorId },
            });

            if (!conversation) throw new HttpException({ message: 'Conversation not found' }, HttpStatus.NOT_FOUND);

            const newMessage = new this.messageModel({
                sender: initiatorId,
                text: message,
            });

            conversation.messages.push(newMessage._id);

            const { 0: savedMessage } = await Promise.all([newMessage.save(), conversation.save()]);
            const populatedMessage = await savedMessage.populate([
                { path: 'sender', model: 'User', select: 'name email' },
            ]);

            return populatedMessage;
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    };

    delete = async ({ conversationId, messageId, initiatorId }: DeleteMessageType) => {
        try {
            const message = await this.messageModel.findOne({ _id: messageId, sender: initiatorId });
            
            if (!message) throw new ForbiddenException({ message: 'You are not allowed to delete this message' });

            const conversation = await this.conversationService.findOneByPayload({
                _id: conversationId,
                participants: { $in: initiatorId },
                messages: { $in: message._id },
            });

            if (!conversation) throw new ForbiddenException({ message: 'You are not allowed to delete this message' });

            conversation.messages = conversation.messages.filter((messageId) => messageId.toString() !== message._id.toString());

            await Promise.all([message.deleteOne(), conversation.save()]);

            return { success: true };
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    };
}