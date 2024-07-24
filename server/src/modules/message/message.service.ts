import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { DeleteMessageType, EditMessageParams, SendMessageParams } from './types';
import { ConversationService } from '../conversation/conversation.service';
import { AppException } from 'src/utils/exceptions/app.exception';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<Message>,
        private readonly conversationService: ConversationService,
    ) {}

    send = async ({ recipientId, message, initiatorId }: SendMessageParams) => {
        const conversation = await this.conversationService.findOneByPayload({
            participants: { $all: [new Types.ObjectId(recipientId), initiatorId] },
        });

        if (!conversation) throw new AppException({ message: 'Conversation not found' }, HttpStatus.NOT_FOUND);

        const newMessage = new this.messageModel({ sender: initiatorId, text: message.trim() });

        Object.assign(conversation, {
            lastMessage: newMessage._id,
            lastMessageSentAt: newMessage.createdAt.toISOString(),
            messages: [...conversation.messages, newMessage._id],
        });

        const { 0: savedMessage } = await Promise.all([newMessage.save(), conversation.save()]);

        const populatedMessage = (await savedMessage.populate([{ path: 'sender', model: 'User', select: 'name email official' }])).toObject();

        return { message: populatedMessage, conversationId: conversation._id.toString() };
    };

    edit = async ({ messageId, initiatorId, message: newMessage, conversationId, recipientId }: EditMessageParams) => {
        const conversation = await this.conversationService.findOneByPayload({ 
            _id: conversationId, 
            participants: { $all: [initiatorId, new Types.ObjectId(recipientId)] },
            messages: { $in: new Types.ObjectId(messageId) }
        });

        if (!conversation) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);

        const message = await this.messageModel.findOneAndUpdate(
            { _id: messageId, sender: initiatorId, text: { $ne: newMessage.trim() } },
            { text: newMessage.trim(), hasBeenEdited: true },
            { runValidators: true, new: true, populate: { path: 'sender', model: 'User', select: 'name email' } },
        );

        if (!message) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);

        return { message: message.toObject(), conversationId: conversation._id.toString() };
    };

    delete = async ({ conversationId, messageId, initiatorId }: DeleteMessageType) => {
        const message = await this.messageModel.findOne({ _id: messageId, sender: initiatorId });

        if (!message) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);

        const conversation = await this.conversationService.findOneByPayload(
            { _id: conversationId, participants: { $in: initiatorId }, messages: { $in: message._id } },
            { _id: 1, lastMessage: 1, lastMessageSentAt: 1, messages: 1, createdAt: 1 },
            { populate: { path: 'lastMessage', model: 'Message', populate: { path: 'sender', model: 'User', select: 'name' } } },
        );

        if (!conversation) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);
        
        conversation.messages = conversation.messages.filter((id) => id.toString() !== messageId);
        
        const isLastMessage = message._id.toString() === conversation.lastMessage._id.toString();

        if (isLastMessage) {
            const lastMessage = await this.messageModel.findById(conversation.messages[conversation.messages.length - 1], undefined, { populate: { 
                path: 'sender', 
                model: 'User', 
                select: 'name' 
            } });

            conversation.lastMessage = lastMessage?._id;
            conversation.lastMessageSentAt = lastMessage?.createdAt ?? conversation.createdAt;
            
            await Promise.all([message.deleteOne(), conversation.save()]);
            
            return {
                isLastMessage,
                lastMessage: lastMessage?.toObject(),
                lastMessageSentAt: conversation.lastMessageSentAt,
            };
        }
        
        await Promise.all([message.deleteOne(), conversation.save()]);
        
        return {
            isLastMessage,
            lastMessage: conversation.lastMessage as unknown as Message,
            lastMessageSentAt: conversation.lastMessageSentAt,
        };
    };

    findOneByPayload = async (
        payload: FilterQuery<Message>,
        projection?: ProjectionType<Message>,
        options?: QueryOptions<Message>,
    ) => this.messageModel.findOne(payload, projection, options);

    findManyByPayload = async (
        payload: FilterQuery<Message>,
        projection?: ProjectionType<Message>,
        options?: QueryOptions<Message>,
    ) => this.messageModel.find(payload, projection, options);
}