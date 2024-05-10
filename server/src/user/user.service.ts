import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { SignupDTO } from 'src/auth/dtos/auth.signup.dto';
import { Conversation } from 'src/conversation/schemas/conversation.schema';
import { CreateUserType, UserDocumentType, UserProfileType } from './types';
import { USER_NOT_FOUND } from 'src/utils/constants';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>, 
        // ^^ should use conversation service instead but i got error "circular dependency" cuz i already using user service in conversation service 
    ) {}

    findOneByPayload = async (
        payload: FilterQuery<User>,
        projection?: ProjectionType<User>,
        options?: QueryOptions<User>,
    ) => this.userModel.findOne(payload, projection, options);

    findManyByPayload = async (
        payload: FilterQuery<User>,
        projection?: ProjectionType<User>,
        options?: QueryOptions<User>,
    ) => this.userModel.find(payload, projection, options);

    searchUser = async (initiatorId: Types.ObjectId, name: string) => {
        try {
            const users = await this.userModel.find(
                {
                    _id: { $ne: initiatorId },
                    name: { $regex: name, $options: 'i' },
                    isPrivate: false,
                },
                { _id: 1, name: 1 },
            );

            if (!users.length) throw new HttpException(USER_NOT_FOUND, USER_NOT_FOUND.status);

            return users;
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    };

    getConversations = async (_id: Types.ObjectId) => {
        try {
            const conversations = await this.conversationModel
                .find({ participants: { $in: _id } }, { messages: { $slice: -1 } })
                .lean()
                .populate([
                    {
                        path: 'participants',
                        model: 'User',
                        select: 'name email',
                    },
                    {
                        path: 'messages',
                        model: 'Message',
                        populate: {
                            path: 'sender',
                            model: 'User',
                            select: 'name email',
                        },
                    },
                ]);
            return conversations;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    findById = async (id: string | Types.ObjectId) => {
        const candidate = await this.userModel.findById(id);

        if (!candidate) throw new UnauthorizedException();

        return candidate;
    };

    profile = async (user: UserDocumentType): Promise<UserProfileType> => {
        const conversations = await this.getConversations(user._id);
        const { password, ...rest } = user.toObject();

        return { ...rest, conversations };
    };

    create = async (userDetails: SignupDTO): Promise<CreateUserType & { _id: Types.ObjectId }> => {
        const password = await hash(userDetails.password, 10);
        const { password: _, ...user } = (await new this.userModel({ ...userDetails, password }).save()).toObject();

        return user;
    };
}