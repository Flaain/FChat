import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { ConversationDocument, CreateConversationArgs, IConversationService } from './types';
import { UserService } from 'src/user/user.service';
import { CONVERSATION_ALREADY_EXISTS, CONVERSATION_WITH_MYSELF } from './utils/conversation.constants';
import { UserDocument } from 'src/user/types';
import { Message } from 'src/message/schemas/message.schema';

@Injectable()
export class ConversationService implements IConversationService {
    constructor(
        @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
        @InjectModel(Message.name) private readonly messageModel: Model<Message>, 
        // ^^^ that's bad but need it for delete conversation, can't use message service because of circular dependency
        private readonly userService: UserService,
    ) {}

    createConversation = async ({ initiatorId, recipientId }: CreateConversationArgs): Promise<Pick<ConversationDocument, "_id" | "lastMessageSentAt"> & { recipient: UserDocument }> => {
        try {
            if (initiatorId.toString() === recipientId) throw new HttpException(CONVERSATION_WITH_MYSELF, CONVERSATION_WITH_MYSELF.status);

            const recipient = await this.userService.findOneByPayload({ _id: recipientId, isPrivate: false }, { _id: 1, name: 1, email: 1, official: 1 });

            if (!recipient) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

            const isConversationExists = await this.conversationModel.findOne({ participants: { $all: [initiatorId, recipient._id] } });

            if (isConversationExists) throw new ConflictException(CONVERSATION_ALREADY_EXISTS);

            const { _id, lastMessageSentAt } = (await new this.conversationModel({ participants: [initiatorId, recipient._id] }).save()).toObject();
            
            return { _id, lastMessageSentAt, recipient: recipient.toObject() };
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    };

    deleteConversation = async ({ initiatorId, conversationId }: { initiatorId: Types.ObjectId; conversationId: string }) => {
        try {
            const conversation = await this.conversationModel.findOne({ _id: conversationId, participants: { $in: initiatorId } });

            if (!conversation) throw new HttpException('conversation not found', HttpStatus.NOT_FOUND);

            await Promise.all([this.messageModel.deleteMany({ _id: { $in: conversation.messages } }), conversation.deleteOne()]);

            return { success: true };
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    }

    getConversations = async ({ initiatorId, cursor }: { initiatorId: Types.ObjectId; cursor?: string }) => {
        try {
            const CONVERSATION_BATCH = 10;
            let nextCursor: string | null = null;

            const conversations = await this.conversationModel
                .find(
                    { participants: { $in: initiatorId }, ...(cursor && { lastMessageSentAt: { $lt: cursor } }) },
                    { lastMessage: 1, participants: 1, lastMessageSentAt: 1 },
                    {
                        limit: CONVERSATION_BATCH,
                        populate: [
                            { path: 'participants', model: 'User', select: 'name email official', match: { _id: { $ne: initiatorId } } },
                            { path: 'lastMessage', model: 'Message', populate: { path: 'sender', model: 'User', select: 'name' } },
                        ],
                        sort: { lastMessageSentAt: -1 },
                    },
                )
                .lean();

            conversations.length === CONVERSATION_BATCH && (nextCursor = conversations[CONVERSATION_BATCH - 1].lastMessageSentAt.toISOString());

            return { conversations, nextCursor  };
        } catch (error) {
            console.log(error);
            return { conversations: [], nextCursor: null };
        }
    };

    getConversation = async ({
        initiator,
        recipientId,
        cursor,
    }: {
        initiator: UserDocument;
        recipientId: string;
        cursor?: string;
    }) => {
        try {
            const recipient = await this.userService.findOneByPayload({ _id: recipientId }, { name: 1, email: 1, lastSeenAt: 1, isPrivate: 1, official: 1 });

            if (!recipient) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

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
                                    select: 'name email official',
                                },
                                options: {
                                    limit: MESSAGES_BATCH + 1,
                                    sort: { createdAt: -1 },
                                },
                                ...(cursor && { match: { _id: { $lt: cursor } } }),
                            },
                        ],
                    },
                )
                .lean();

            if (!conversation) {
                if (recipient.isPrivate) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
                return { conversation: { recipient, messages: [] }, nextCursor };
            };

            conversation.messages.length > MESSAGES_BATCH && (nextCursor = (conversation.messages[MESSAGES_BATCH - 1]._id.toString()), conversation.messages.pop());

            return { conversation: { _id: conversation._id, recipient, messages: conversation.messages.reverse() }, nextCursor };
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    };

    findOneByPayload = async (
        payload: FilterQuery<Conversation>,
        projection?: ProjectionType<Conversation>,
        options?: QueryOptions<Conversation>,
    ) => this.conversationModel.findOne(payload, projection, options);

    findManyByPayload = async (
        payload: FilterQuery<Conversation>,
        projection?: ProjectionType<Conversation>,
        options?: QueryOptions<Conversation>,
    ) => this.conversationModel.find(payload, projection, options);
}