import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Conversation } from './schemas/conversation.schema';
import { UserDocumentType } from 'src/user/types';
import { ConversationCreateDTO } from './dtos/conversation.create.dto';

@Injectable()
export class ConversationService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
    ) {}

    createConversation = async ({ initiator, participants, name }: ConversationCreateDTO & { initiator: UserDocumentType }) => {
        const users = await this.userModel.find({ _id: { $in: participants } });

        if (users.length !== participants.length) throw new HttpException('Cannot create conversation', HttpStatus.BAD_REQUEST);

        const isConversationExist = await this.conversationModel.findOne({ participants: { $all: participants } });

        if (isConversationExist) throw new HttpException({ message: 'Conversation already exists', conversationId: isConversationExist._id }, HttpStatus.BAD_REQUEST);

        const conversation = new this.conversationModel({ participants: users.map(user => user._id), name, creator: initiator._id });
        
        const savedConversation = await conversation.save();
        const populatedConversation = await savedConversation.populate([
            { path: 'participants', model: 'User', select: 'name email' },
            { path: 'messages', model: 'Message', populate: { path: 'sender', model: 'User', select: 'name email' } },
            { path: 'creator', model: 'User', select: 'name email' },
        ]);

        return populatedConversation;
    }
}
