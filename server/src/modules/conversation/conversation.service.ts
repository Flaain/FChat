import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { ConversationDocument, IConversationService } from './types';
import { AppException } from 'src/utils/exceptions/app.exception';
import { Message } from '../message/schemas/message.schema';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/types';
import { BaseService } from 'src/utils/services/base/base.service';

@Injectable()
export class ConversationService extends BaseService<ConversationDocument, Conversation> implements IConversationService {
    constructor(
        @InjectModel(Conversation.name) private readonly conversationModel: Model<ConversationDocument>,
        @InjectModel(Message.name) private readonly messageModel: Model<Message>,
        private readonly userService: UserService,
    ) {
        super(conversationModel);
    }

    deleteConversation = async ({ initiatorId, recipientId }: { initiatorId: Types.ObjectId; recipientId: string }) => {
        const recipient = await this.userService.findOne({ _id: recipientId }, { birthDate: 0, password: 0, isPrivate: 0 });
        
        if (!recipient) throw new AppException({ message: 'User not found' }, HttpStatus.NOT_FOUND);

        const conversation = await this.findOne({ participants: { $all: [initiatorId, recipient._id] } });

        if (!conversation) throw new AppException({ message: 'Conversation not found' }, HttpStatus.NOT_FOUND);

        await Promise.all([this.messageModel.deleteMany({ _id: { $in: conversation.messages } }), conversation.deleteOne()]);

        return { _id: conversation._id, recipientId: recipient._id.toString() };
    };
    
    getConversation = async ({ initiator, recipientId, cursor }: { initiator: UserDocument; recipientId: string; cursor?: string }) => {
        const recipient = await this.userService.findOne(
            { _id: recipientId },
            { birthDate: 0, password: 0, isPrivate: 0 },
            {
                populate: {
                    path: 'blockList',
                    model: 'User',
                    match: { _id: initiator._id },
                },
            },
        );

        if (!recipient) throw new AppException({ message: "User not found" }, HttpStatus.NOT_FOUND);

        const MESSAGES_BATCH = 10;

        let nextCursor: string | null = null;

        const conversation = await this.findOne(
            { participants: { $all: [initiator._id, recipient._id] } },
            { messages: 1 },
            {
                populate: [
                    {
                        path: 'messages',
                        model: 'Message',
                        populate: [
                            {
                                path: 'sender',
                                model: 'User',
                                select: 'login name email isOfficial isDeleted presence',
                            },
                            {
                                path: 'replyTo',
                                model: 'Message',
                                select: 'text',
                                populate: { path: 'sender', model: 'User', select: 'name' },
                            },
                        ],
                        options: {
                            limit: MESSAGES_BATCH,
                            sort: { createdAt: -1 },
                        },
                        ...(cursor && { match: { _id: { $lt: cursor } } }),
                    },
                ],
            },
        ).lean();
        
        const isInitiatorBlocked = !!recipient.blockList.length;
        const isRecipientBlocked = !!initiator.blockList.find((id) => id.toString() === recipientId);

        if (!conversation) {
            if (recipient.isPrivate) throw new AppException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
            return { conversation: { recipient, messages: [], isInitiatorBlocked, isRecipientBlocked }, nextCursor };
        }

        conversation.messages.length === MESSAGES_BATCH && (nextCursor = conversation.messages[MESSAGES_BATCH - 1]._id.toString());

        return {
            conversation: { _id: conversation._id, recipient, messages: conversation.messages.reverse(), isInitiatorBlocked, isRecipientBlocked },
            nextCursor,
        };
    };
}