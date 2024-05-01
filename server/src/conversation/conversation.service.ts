import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

    createConversation = async ({ initiator, participants, name }: CreateConversationArgs) => {
        const users = await this.userModel.find({ _id: { $in: participants, $ne: initiator._id }, isPrivate: false });

        if (!users.length) throw new HttpException({ message: 'Users not found' }, HttpStatus.BAD_REQUEST);

        const _participants = [...users.map((user) => user._id), initiator._id];

        const isConversationExist = await this.conversationModel.findOne({ participants: { $all: _participants } });

        if (isConversationExist) throw new HttpException(CONVERSATION_ALREADY_EXISTS, CONVERSATION_ALREADY_EXISTS.status);

        const conversation = new this.conversationModel({
            participants: _participants,
            creator: initiator._id,
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
}