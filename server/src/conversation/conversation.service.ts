import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { CreateConversationArgs, IConversationService } from './types';
import { UserService } from 'src/user/user.service';
import { CONVERSATION_ALREADY_EXISTS } from './utils/conversation.constants';
import { Message } from 'src/message/schemas/message.schema';
import { CONVERSATION_POPULATE } from 'src/utils/constants';

@Injectable()
export class ConversationService implements IConversationService {
    constructor(
        @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
        private readonly userService: UserService,
    ) {}

    createConversation = async ({ initiatorId, recipientId }: CreateConversationArgs) => {
        try {
            const recipient = await this.userService.findById(recipientId);

            if (!recipient) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

            const isConversationExists = await this.conversationModel.findOne({ participants: { $all: [initiatorId, recipient._id] } });
            
            if (isConversationExists) throw new ConflictException(CONVERSATION_ALREADY_EXISTS);

            const conversation = await new this.conversationModel({ participants: [initiatorId, recipientId] }).save();
            
            return conversation.populate(CONVERSATION_POPULATE);
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    };

    getConversation = async ({
        initiatorId,
        conversationId,
        cursor,
    }: {
        initiatorId: Types.ObjectId;
        conversationId: string;
        cursor?: string;
    }) => {
        try {
            const MESSAGES_BATCH = 10;
            let nextCursor: string | null = null;
    
            const conversation = await this.conversationModel.findOne({ _id: conversationId, participants: { $in: initiatorId } }, undefined, {
                populate: [
                    { path: 'participants', model: 'User', select: 'name email isVerified' },
                    {
                        path: 'messages',
                        model: 'Message',
                        populate: {
                            path: 'sender',
                            model: 'User',
                            select: 'name email isVerified',
                        },
                        options: {
                            limit: MESSAGES_BATCH,
                            sort: { createdAt: -1 },
                        },
                        ...(cursor ? { match: { createdAt: { $lt: cursor } } } : {}),
                    },
                ],
            }).lean();
    
            if (!conversation) throw new HttpException({ message: 'Conversation not found' }, HttpStatus.NOT_FOUND);
    
            conversation.messages.length === MESSAGES_BATCH && (nextCursor = (conversation.messages[MESSAGES_BATCH - 1] as unknown as Message & { 
                createdAt: string 
            }).createdAt);
    
            return { conversation: {  ...conversation, messages: conversation.messages.reverse() }, nextCursor };
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