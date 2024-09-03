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

        const recipient = await this.userService.findOne({
            filter: { _id: recipientId, isDeleted: false },
            projection: { password: 0 },
            options: {
                populate: {
                    path: 'blockList',
                    match: { _id: initiator._id },
                },
            },
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
        const ctx = { isNewConversation: false, conversation: null };
        const { recipient, isMessagingRestricted } = await this.isMessagingRestricted({ recipientId, initiator });

        if (isMessagingRestricted) throw new AppException({ message: 'Messaging restricted' }, HttpStatus.FORBIDDEN);

        ctx.conversation = await this.conversationService.findOne({
            filter: { participants: { $all: [recipient._id, initiator._id] } },
            projection: { _id: 1 },
        });
        
        if (!ctx.conversation) {
            if (recipient.isPrivate) throw new AppException({ message: 'Cannot send message' }, HttpStatus.NOT_FOUND);

            ctx.isNewConversation = true;
            ctx.conversation = await this.conversationService.create({ participants: [recipient._id, initiator._id] });
        };

        const newMessage = await this.create({ sender: initiator._id, text: message.trim() });
        const updateQuery = { lastMessage: newMessage._id, lastMessageSentAt: newMessage.createdAt }
        
        Object.assign(ctx.conversation, updateQuery);
        
        await ctx.conversation.updateOne({ ...updateQuery, $push: { messages: newMessage._id } });

        const populatedMessage = await newMessage.populate([{ path: 'sender', model: 'User', select: 'name email official' }]);

        return { ...ctx, message: populatedMessage, recipient };
    };

    reply = async ({ messageId, recipientId, message, initiator }: MessageReplyDTO & { initiator: UserDocument, messageId: string }) => {
        if (!isValidObjectId(messageId)) throw new AppException({ message: 'Invalid message id' }, HttpStatus.BAD_REQUEST);

        const { recipient, isMessagingRestricted } = await this.isMessagingRestricted({ recipientId, initiator });

        if (isMessagingRestricted) throw new AppException({ message: 'Messaging restricted' }, HttpStatus.FORBIDDEN);

        const replyMessage = await this.findById(messageId);

        if (!replyMessage) throw new AppException({ message: 'Cannot reply to a message that does not exist' }, HttpStatus.NOT_FOUND);

        const conversation = await this.conversationService.findOne({
            filter: { participants: { $all: [recipient._id, initiator._id] }, messages: { $in: replyMessage._id } },
            projection: { _id: 1 },
        });

        if (!conversation) throw new AppException({ message: 'Conversation not found' }, HttpStatus.NOT_FOUND);

        const newMessage = await this.create({ sender: initiator._id, text: message.trim(), replyTo: replyMessage._id });

        const { 0: populatedMessage } = await Promise.all([
            newMessage.populate([
                { path: 'sender', model: 'User', select: 'name email official' },
                { path: 'replyTo', model: 'Message', select: 'text sender', populate: { path: 'sender', model: 'User', select: 'name' } },
            ]),
            replyMessage.updateOne({ $push: { replies: newMessage._id } }),
            conversation.updateOne({ lastMessage: newMessage._id, lastMessageSentAt: newMessage.createdAt, $push: { messages: newMessage._id } }),
        ]);

        return { message: populatedMessage, conversationId: conversation._id.toString() };
    }

    edit = async ({ messageId, initiatorId, message: newMessage, recipientId }: EditMessageParams) => {
        const conversation = await this.conversationService.findOne({
            filter: {
                participants: { $all: [initiatorId, new Types.ObjectId(recipientId)] },
                messages: { $in: new Types.ObjectId(messageId) },
            },
            projection: { _id: 1, lastMessage: 1 },
        });

        if (!conversation) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);

        const message = await this.findOneAndUpdate({
            filter: { _id: messageId, sender: initiatorId, text: { $ne: newMessage.trim() } },
            update: { text: newMessage.trim(), hasBeenEdited: true },
            options: {
                runValidators: true,
                populate: [
                    { path: 'sender', model: 'User', select: 'name email' },
                    {
                        path: 'replyTo',
                        model: 'Message',
                        select: 'text sender',
                        populate: { path: 'sender', model: 'User', select: 'name' },
                    },
                ],
            },
        });

        if (!message) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);

        return { 
            message: message.toObject(), 
            conversationId: conversation._id.toString(), 
            isLastMessage: message._id.toString() === conversation.lastMessage._id.toString()
        };
    };

    deleteMessage = async ({ conversationId, messageId, initiatorId }: DeleteMessageType) => {
        const message = await this.findOne({ filter: { _id: messageId, sender: initiatorId } });

        if (!message) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);

        const conversation = await this.conversationService.findOne({
            filter: { _id: conversationId, participants: { $in: initiatorId }, messages: { $in: message._id } },
            projection: { _id: 1, lastMessage: 1, lastMessageSentAt: 1, messages: 1, createdAt: 1 },
            options: {
                populate: {
                    path: 'lastMessage',
                    model: 'Message',
                    populate: { path: 'sender', model: 'User', select: 'name' },
                },
            },
        });

        if (!conversation) throw new AppException({ message: "Forbidden" }, HttpStatus.FORBIDDEN);
        
        const isLastMessage = message._id.toString() === conversation.lastMessage._id.toString();
        const filteredMessages = conversation.messages.filter((id) => id.toString() !== message._id.toString());
        const lastMessage = filteredMessages.length ? !isLastMessage ? conversation.lastMessage : await this.findById(filteredMessages[filteredMessages.length - 1], {
            options: {
                populate: {
                    path: 'sender',
                    model: 'User',
                    select: 'name',
                },
            },
        }) : undefined;

        await Promise.all([
            message.deleteOne(),
            conversation.updateOne({
                lastMessage: lastMessage?._id,
                lastMessageSentAt: (lastMessage as Message)?.createdAt ?? conversation.createdAt,
                $set: { messages: filteredMessages },
            }),
        ]);
        
        return {
            lastMessage,
            isLastMessage,
            lastMessageSentAt: conversation.lastMessageSentAt,
        };
    };
}