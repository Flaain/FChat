import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Conversation } from './schemas/conversation.schema';
import { CONVERSATION_ALREADY_EXISTS } from 'src/utils/constants';
import { CreateConversationArgs, IConversationService } from './types';

@Injectable()
export class ConversationService implements IConversationService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
    ) {}

    createConversation = async ({ initiatorId, participants, name }: CreateConversationArgs) => {
        const users = await this.userModel.find({ _id: { $in: participants, $ne: initiatorId }, isPrivate: false });

        if (!users.length) throw new HttpException({ message: 'Users not found' }, HttpStatus.BAD_REQUEST);

        const _participants = [...users.map((user) => user._id), initiatorId];

        const isConversationExist = await this.conversationModel.findOne({ participants: { $all: _participants } });

        if (isConversationExist)
            throw new HttpException(CONVERSATION_ALREADY_EXISTS, CONVERSATION_ALREADY_EXISTS.status);

        const conversation = new this.conversationModel({
            participants: _participants,
            creator: initiatorId,
            ...(_participants.length > 2 && { name }),
        });

        const savedConversation = await conversation.save();
        const populatedConversation = await savedConversation.populate([
            { path: 'participants', model: 'User', select: 'name email' },
            { path: 'messages', model: 'Message', populate: { path: 'sender', model: 'User', select: 'name email' } },
            { path: 'creator', model: 'User', select: 'name email' },
        ]);

        return populatedConversation;
    };

    getConversation = async (initiatorId: Types.ObjectId, conversationId: string) => {
        const conversation = await this.conversationModel
            .findOne({ _id: conversationId, participants: { $in: [initiatorId] } })
            .populate([
                { path: 'participants', model: 'User', select: 'name email' },
                {
                    path: 'messages',
                    model: 'Message',
                    populate: { path: 'sender', model: 'User', select: 'name email' },
                },
                { path: 'creator', model: 'User', select: 'name email' },
            ]);

        if (!conversation) throw new HttpException({ message: 'Conversation not found' }, HttpStatus.BAD_REQUEST);

        return conversation;
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