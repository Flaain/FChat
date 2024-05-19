import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AggregateOptions, FilterQuery, Model, PipelineStage, ProjectionType, QueryOptions, Types } from 'mongoose';
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

    createConversation = async ({ initiatorId, participants, name }: CreateConversationArgs) => {
        try {
            const users = await this.userService.findManyByPayload({
                _id: { $in: participants, $ne: initiatorId },
                isPrivate: false,
            });
    
            if (!users.length) throw new HttpException({ message: 'Users not found' }, HttpStatus.BAD_REQUEST);
    
            const _participants = [...users.map((user) => user._id), initiatorId];
    
            const isConversationExist = await this.conversationModel.findOne({ participants: { $all: _participants } });
    
            if (isConversationExist) throw new ConflictException(CONVERSATION_ALREADY_EXISTS);
    
            const conversation = new this.conversationModel({
                participants: _participants,
                creator: initiatorId,
                name: _participants.length > 2 && name ? name.trim() : null,
            });
    
            const savedConversation = await conversation.save();
    
            return savedConversation.populate(CONVERSATION_POPULATE);
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
                    { path: 'participants', model: 'User', select: 'name email' },
                    {
                        path: 'messages',
                        model: 'Message',
                        populate: {
                            path: 'sender',
                            model: 'User',
                            select: 'name email',
                        },
                        options: {
                            limit: MESSAGES_BATCH,
                            sort: { createdAt: -1 },
                        },
                        ...(cursor ? { match: { createdAt: { $lt: cursor } } } : {}),
                    },
                    { path: 'creator', model: 'User', select: 'name email' },
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

    aggregate = async (pipeline?: Array<PipelineStage>, options?: AggregateOptions) => this.conversationModel.aggregate(pipeline, options);

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