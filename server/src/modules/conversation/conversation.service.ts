import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { IConversationService } from './types';
import { AppException } from 'src/utils/exceptions/app.exception';
import { Message } from '../message/schemas/message.schema';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/types';

@Injectable()
export class ConversationService implements IConversationService {
    constructor(
        @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
        @InjectModel(Message.name) private readonly messageModel: Model<Message>,
        // ^^^ that's bad but need it for delete conversation, can't use message service because of circular dependency
        private readonly userService: UserService,
    ) {}

    createConversation = async ({ initiatorId, recipientId }: { initiatorId: Types.ObjectId; recipientId: string }) => {
        if (initiatorId.toString() === recipientId) {
            throw new AppException({ message: 'Cannot create conversation with yourself' }, HttpStatus.BAD_REQUEST)
        }

        const recipient = await this.userService.findOneByPayload(
            { _id: recipientId, isPrivate: false, isDeleted: false },
            { birthDate: 0, password: 0 },
        );

        if (!recipient) throw new AppException({ message: 'User not found' }, HttpStatus.NOT_FOUND);

        if (await this.conversationModel.exists({ participants: { $all: [initiatorId, recipient._id] } })) {
            throw new AppException({ message: 'Conversation already exists' }, HttpStatus.CONFLICT)
        }

        const { _id, lastMessageSentAt } = (await new this.conversationModel({ participants: [initiatorId, recipient._id] }).save()).toObject();

        return { _id, lastMessageSentAt, recipient: recipient.toObject() };
    };

    deleteConversation = async ({ initiatorId, conversationId }: { initiatorId: Types.ObjectId; conversationId: string }) => {
        const conversation = await this.conversationModel.findOne({ _id: conversationId, participants: { $in: initiatorId } });

        if (!conversation) throw new AppException({ message: 'Conversation not found' }, HttpStatus.NOT_FOUND);

        await Promise.all([
            this.messageModel.deleteMany({ _id: { $in: conversation.messages } }),
            conversation.deleteOne(),
        ]);

        return { _id: conversation._id };
    };

    getConversation = async ({ initiator, recipientId, cursor }: { initiator: UserDocument; recipientId: string; cursor?: string }) => {
        const recipient = await this.userService.findOneByPayload({ _id: recipientId }, { birthDate: 0, password: 0, isPrivate: 0 });

        if (!recipient) throw new AppException({ message: "User not found" }, HttpStatus.NOT_FOUND);

        const MESSAGES_BATCH = 10;

        let nextCursor: string | null = null;

        const conversation = await this.conversationModel
            .findOne(
                { participants: { $all: [initiator._id, recipient._id] } },
                { messages: 1 },
                {
                    populate: [
                        {
                            path: 'messages',
                            model: 'Message',
                            populate: {
                                path: 'sender',
                                model: 'User',
                                select: 'login name email isOfficial isDeleted presence',
                            },
                            options: {
                                limit: MESSAGES_BATCH,
                                sort: { createdAt: -1 },
                            },
                            ...(cursor && { match: { _id: { $lt: cursor } } }),
                        },
                    ],
                },
            )
            .lean();

        if (!conversation) {
            if (recipient.isPrivate) throw new AppException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
            return { conversation: { recipient, messages: [] }, nextCursor };
        }

        conversation.messages.length === MESSAGES_BATCH && (nextCursor = conversation.messages[MESSAGES_BATCH - 1]._id.toString());

        return {
            conversation: { _id: conversation._id, recipient, messages: conversation.messages.reverse() },
            nextCursor,
        };
    };

    findOneByPayload = (
        payload: FilterQuery<Conversation>,
        projection?: ProjectionType<Conversation>,
        options?: QueryOptions<Conversation>,
    ) => this.conversationModel.findOne(payload, projection, options);

    findManyByPayload = (
        payload: FilterQuery<Conversation>,
        projection?: ProjectionType<Conversation>,
        options?: QueryOptions<Conversation>,
    ) => this.conversationModel.find(payload, projection, options);
}