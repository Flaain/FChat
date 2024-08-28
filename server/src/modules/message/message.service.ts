import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model, Types, isValidObjectId } from 'mongoose';
import { DeleteMessageType, EditMessageParams, MessageDocument, SendMessageParams } from './types';
import { ConversationService } from '../conversation/conversation.service';
import { AppException } from 'src/utils/exceptions/app.exception';
import { BaseService } from 'src/utils/services/base/base.service';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/types';
import { MessageReplyDTO } from './dtos/message.reply.dto';
import { ConversationDocument } from '../conversation/types';

@Injectable()
export class MessageService extends BaseService<MessageDocument, Message> {
    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
        private readonly userService: UserService,
        private readonly conversationService: ConversationService,
    ) {
        super(messageModel);
    }

    private isMessagingRestricted = async ({ initiator, recipientId }: { initiator: UserDocument; recipientId: string }) => {
        if (!isValidObjectId(recipientId) || recipientId === initiator._id.toString()) throw new AppException({ 
            message: 'Invalid recipient id' 
        }, HttpStatus.BAD_REQUEST);

        const recipient = await this.userService.findOne({ _id: recipientId, isDeleted: false }, { password: 0 }, {
            populate: {
                path: 'blockList',
                match: { _id: initiator._id },
            }
        });

        if (!recipient) throw new AppException({ message: 'User not found' }, HttpStatus.NOT_FOUND);

        const isInitiatorBlocked = recipient.blockList.some((id) => id.toString() === initiator._id.toString());
        const isRecipientBlocked = initiator.blockList.some((id) => id.toString() === recipient._id.toString());

        return {
            recipient,
            isMessagingRestricted: isInitiatorBlocked || isRecipientBlocked,
        };
    }

    send = async ({ recipientId, message, initiator }: SendMessageParams) => {
        let isNewConversation = false;
        let conversation: ConversationDocument | null = null;

        const { recipient, isMessagingRestricted } = await this.isMessagingRestricted({ recipientId, initiator });

        if (isMessagingRestricted) throw new AppException({ message: 'Messaging restricted' }, HttpStatus.FORBIDDEN);

        conversation = await this.conversationService.findOne(
            { participants: { $all: [recipient._id, initiator._id] } },
            { _id: 1 },
        );
        
        if (!conversation) {
            if (recipient.isPrivate) throw new AppException({ message: 'Cannot send message' }, HttpStatus.NOT_FOUND);

            isNewConversation = true;

            conversation = await this.conversationService.create({ participants: [recipient._id, initiator._id] });
        };

        const newMessage = await this.create({ sender: initiator._id, text: message.trim() });

        const { 0: savedMessage } = await Promise.all([ 
            newMessage.save(),
            conversation.updateOne({ lastMessage: newMessage._id, lastMessageSentAt: newMessage.createdAt, $push: { messages: newMessage._id } })
        ]);

        const populatedMessage = (await savedMessage.populate([{ path: 'sender', model: 'User', select: 'name email official' }])).toObject();

        return { message: populatedMessage, conversation, recipient, isNewConversation };
    };

    reply = async ({ messageId, recipientId, message, initiator }: MessageReplyDTO & { initiator: UserDocument, messageId: string }) => {
        if (!isValidObjectId(messageId)) throw new AppException({ message: 'Invalid message id' }, HttpStatus.BAD_REQUEST);

        const { recipient, isMessagingRestricted } = await this.isMessagingRestricted({ recipientId, initiator });

        if (isMessagingRestricted) throw new AppException({ message: 'Messaging restricted' }, HttpStatus.FORBIDDEN);

        const replyMessage = await this.findById(messageId);

        if (!replyMessage) throw new AppException({ message: 'Cannot reply to a message that does not exist' }, HttpStatus.NOT_FOUND);

        const conversation = await this.conversationService.findOne(
            { participants: { $all: [recipient._id, initiator._id] }, messages: { $in: replyMessage._id } },
            { _id: 1 },
        );

        if (!conversation) throw new AppException({ message: 'Conversation not found' }, HttpStatus.NOT_FOUND);

        const newMessage = await this.create({ sender: initiator._id, text: message.trim(), replyTo: replyMessage._id });

        const { 0: savedMessage } = await Promise.all([
            newMessage.save(),
            replyMessage.updateOne({ $push: { replies: newMessage._id } }),
            conversation.updateOne({ lastMessage: newMessage._id, lastMessageSentAt: newMessage.createdAt, $push: { messages: newMessage._id } }),
        ]);

        const populatedMessage = (
            await savedMessage.populate([
                { path: 'sender', model: 'User', select: 'name email official' },
                {
                    path: 'replyTo',
                    model: 'Message',
                    select: 'text',
                    populate: { path: 'sender', model: 'User', select: 'name' },
                },
            ])
        ).toObject();

        return { message: populatedMessage, conversationId: conversation._id.toString() };
    }

    edit = async ({ messageId, initiatorId, message: newMessage, conversationId, recipientId }: EditMessageParams) => {
        const conversation = await this.conversationService.findOne(
            {
                _id: conversationId,
                participants: { $all: [initiatorId, new Types.ObjectId(recipientId)] },
                messages: { $in: new Types.ObjectId(messageId) },
            },
            { _id: 1, lastMessage: 1 }, 
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
            isLastMessage: message._id.toString() === conversation.lastMessage._id.toString()
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