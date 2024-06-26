import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model, Types } from 'mongoose';
import { ConversationService } from 'src/conversation/conversation.service';
import { DeleteMessageType, EditMessageType, SendMessageType } from './types';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<Message>,
        private readonly conversationService: ConversationService,
    ) {}

    send = async ({ recipientId, message, initiatorId }: SendMessageType) => {
        try {
            const conversation = await this.conversationService.findOneByPayload({ participants: { $all: [new Types.ObjectId(recipientId), initiatorId] } });

            if (!conversation) throw new HttpException({ message: 'Conversation not found' }, HttpStatus.NOT_FOUND);

            const newMessage = new this.messageModel({
                sender: initiatorId,
                text: message.trim(),
            });

            Object.assign(conversation, { 
                lastMessage: newMessage._id, 
                lastMessageSentAt: newMessage.createdAt.toISOString(), 
                messages: [...conversation.messages, newMessage._id] 
            });

            const { 0: savedMessage } = await Promise.all([newMessage.save(), conversation.save()]);

            const populatedMessage = (await savedMessage.populate([{ path: 'sender', model: 'User', select: 'name email isVerified' }])).toObject();

            return { ...populatedMessage, conversationId: conversation._id };
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    };

    edit = async ({ messageId, initiatorId, message: newMessage }: EditMessageType) => {
        try {
            const message = await this.messageModel.findOneAndUpdate(
                { _id: messageId, sender: initiatorId, text: { $ne: newMessage.trim() } },
                { text: newMessage.trim(), hasBeenEdited: true },
                { runValidators: true, new: true, populate: { path: 'sender', model: 'User', select: 'name email' } },
            );

            if (!message) throw new ForbiddenException({ message: 'You are not allowed to edit this message' });

            return message;
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
                messages: { $in: new Types.ObjectId(messageId) },
            });

            if (!conversation) throw new ForbiddenException({ message: 'You are not allowed to delete this message' });

            conversation.messages = conversation.messages.filter((id) => id.toString() !== messageId);
            
            messageId === conversation.lastMessage._id.toString() && (conversation.lastMessage = conversation.messages[conversation.messages.length - 1]);
            
            await Promise.all([message.deleteOne(), conversation.save()]);

            return { success: true, messageId };
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    };
}