import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AggregateOptions, FilterQuery, Model, PipelineStage, ProjectionType, QueryOptions, Types } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { CONVERSATION_ALREADY_EXISTS } from 'src/utils/constants';
import { CreateConversationArgs, IConversationService } from './types';
import { UserService } from 'src/user/user.service';
import { CONVERSATION_POPULATE } from './utils/conversation.constants';

@Injectable()
export class ConversationService implements IConversationService {
    constructor(
        @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
        private readonly userService: UserService,
    ) {}

    createConversation = async ({ initiatorId, participants, name }: CreateConversationArgs) => {
        const users = await this.userService.findManyByPayload({
            _id: { $in: participants, $ne: initiatorId },
            isPrivate: false,
        });

        if (!users.length) throw new HttpException({ message: 'Users not found' }, HttpStatus.BAD_REQUEST);

        const _participants = [...users.map((user) => user._id), initiatorId];

        const isConversationExist = await this.conversationModel.findOne({ participants: { $all: _participants } });

        if (isConversationExist)
            throw new HttpException(CONVERSATION_ALREADY_EXISTS, CONVERSATION_ALREADY_EXISTS.status);

        const conversation = new this.conversationModel({
            participants: _participants,
            creator: initiatorId,
            name: _participants.length > 2 && name ? name.trim() : null,
        });

        const savedConversation = await conversation.save();

        return savedConversation.populate(CONVERSATION_POPULATE);
    };

    getConversation = async ({
        initiatorId,
        conversationId,
        page: paramsPage,
        limit: paramsLimit,
    }: {
        initiatorId: Types.ObjectId;
        conversationId: string;
        page?: number;
        limit?: number;
    }) => {
        const page = paramsPage || 1;
        const limit = paramsLimit || 10;

        const conversation = await this.conversationModel.findOne({
            _id: conversationId,
            participants: { $in: initiatorId },
        });

        if (!conversation) throw new HttpException({ message: 'Conversation not found' }, HttpStatus.BAD_REQUEST);

        const count = conversation.messages.length;

        const populated = (
            await conversation.populate([
                { path: 'participants', model: 'User', select: 'name email' },
                {
                    path: 'messages',
                    model: 'Message',
                    populate: { path: 'sender', model: 'User', select: 'name email' },
                    options: { skip: (page - 1) * limit, sort: { createdAt: -1 } },
                    perDocumentLimit: limit,
                },
                { path: 'creator', model: 'User', select: 'name email' },
            ])
        ).toObject();

        return {
            conversation: {
                ...populated,
                messages: populated.messages.reverse(),
            },
            meta: { totalItems: count, totalPages: Math.ceil(count / limit), currentPage: page },
        };
    };

    aggregate = async (pipeline?: Array<PipelineStage>, options?: AggregateOptions) =>
        this.conversationModel.aggregate(pipeline, options);

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