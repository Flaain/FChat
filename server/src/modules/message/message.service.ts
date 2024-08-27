import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model, Types } from 'mongoose';
import { DeleteMessageType, EditMessageParams, MessageDocument, SendMessageParams } from './types';
import { ConversationService } from '../conversation/conversation.service';
import { AppException } from 'src/utils/exceptions/app.exception';
import { BaseService } from 'src/utils/services/base/base.service';
import { UserService } from '../user/user.service';

@Injectable()
export class MessageService extends BaseService<MessageDocument, Message> {
    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
        private readonly userService: UserService,
        private readonly conversationService: ConversationService,
    ) {
        super(messageModel);
    }

    send = async ({ recipientId, message, initiator }: SendMessageParams) => {
        const recipient = await this.userService.findOne({ _id: recipientId, isDeleted: false }, { _id: 1, blockList: 1 }, {
            populate: {
                path: 'blockList',
                match: { _id: initiator._id },
            }
        });

        if (!recipient) throw new AppException({ message: 'User not found' }, HttpStatus.NOT_FOUND);

        const conversation = await this.conversationService.findOne({ participants: { $all: [recipient._id, initiator._id] } });

        if (!conversation) throw new AppException({ message: 'Conversation not found' }, HttpStatus.NOT_FOUND);

        const isInitiatorBlocked = recipient.blockList.some((id) => id.toString() === initiator._id.toString());
        const isRecipientBlocked = initiator.blockList.some((id) => id.toString() === recipient._id.toString());

        const isMessagingRestricted = isInitiatorBlocked || isRecipientBlocked; 

        if (isMessagingRestricted) throw new AppException({ message: 'Messaging restricted' }, HttpStatus.FORBIDDEN);

        const newMessage = await this.create({ sender: initiator._id, text: message.trim() });

        Object.assign(conversation, {
           lastMessage: newMessage._id,
           lastMessageSentAt: newMessage.createdAt,
           messages: [...conversation.messages, newMessage._id],
        });

        const { 0: savedMessage } = await Promise.all([newMessage.save(), conversation.save()]);

        const populatedMessage = (await savedMessage.populate([{ path: 'sender', model: 'User', select: 'name email official' }])).toObject();

        return { message: populatedMessage, conversationId: conversation._id.toString() };
    };

    edit = async ({ messageId, initiatorId, message: newMessage, conversationId, recipientId }: EditMessageParams) => {
        const conversation = await this.conversationService.findOne(
            {
                _id: conversationId,
                participants: { $all: [initiatorId, new Types.ObjectId(recipientId)] },
                messages: { $in: new Types.ObjectId(messageId) },
            },
            { messages: { $slice: -1 } },
        );

        if (!conversation) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);

        const message = await this.findOneAndUpdate(
            { _id: messageId, sender: initiatorId, text: { $ne: newMessage.trim() } },
            { text: newMessage.trim(), hasBeenEdited: true },
            { runValidators: true, populate: { path: 'sender', model: 'User', select: 'name email' } },
        );

        if (!message) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);

        return { 
            message: message.toObject(), 
            conversationId: conversation._id.toString(), 
            isLastMessage: message._id.toString() === conversation.messages[0]?._id.toString() 
        };
    };

    deleteMessage = async ({ conversationId, messageId, initiatorId }: DeleteMessageType) => {
        const message = await this.findOne({ _id: messageId, sender: initiatorId });

        if (!message) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);

        const conversation = await this.conversationService.findOne(
            { _id: conversationId, participants: { $in: initiatorId }, messages: { $in: message._id } },
            { _id: 1, lastMessage: 1, lastMessageSentAt: 1, messages: 1, createdAt: 1 },
            { populate: { path: 'lastMessage', model: 'Message', populate: { path: 'sender', model: 'User', select: 'name' } } },
        );

        if (!conversation) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);
        
        conversation.messages = conversation.messages.filter((id) => id.toString() !== messageId);
        
        const isLastMessage = message._id.toString() === conversation.lastMessage._id.toString();

        if (isLastMessage) {
            const lastMessage = await this.findById(conversation.messages[conversation.messages.length - 1], undefined, { populate: { 
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
            lastMessage: conversation.lastMessage,
            lastMessageSentAt: conversation.lastMessageSentAt,
        };
    };
}