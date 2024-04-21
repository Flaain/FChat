import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SignupDTO } from 'src/auth/dtos/auth.signup.dto';
import { User } from './schemas/user.schema';
import { Conversation } from 'src/conversation/schemas/conversation.schema';
import { UserDocumentType } from './types';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Conversation.name)
        private readonly conversationModel: Model<Conversation>,
    ) {}

    findByPayload = async (payload: Partial<Pick<User, 'email' | 'name'>>) =>
        this.userModel.findOne(payload);

    getConversations = async (_id: Types.ObjectId) => {
        try {
            const conversations = await this.conversationModel
            .find({ participants: { $in: [_id] } })
            .populate([
                { path: 'participants', model: 'User', select: 'name email' },
                { path: 'messages', model: 'Message', populate: { path: 'sender', model: 'User', select: 'name email' } },
            ])
            .lean();
            return conversations;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    findById = async (id: string) => {
        const candidate = await this.userModel.findById(id);

        if (!candidate) throw new UnauthorizedException();

        return candidate;
    };

    profile = async (user: UserDocumentType) => {
        const conversations = await this.getConversations(user._id);
        const { password, ...rest } = user.toObject();

        return { ...rest, conversations };
    };

    create = async ({
        email,
        name,
        password,
        birthDate,
    }: SignupDTO): Promise<Omit<User, 'password'> & { _id: Types.ObjectId }> => {
        const hashedPassword = await hash(password, 10);
        const { password: _, ...user } = (await new this.userModel({ email, name, password: hashedPassword, birthDate }).save()).toObject();

        return user;
    };
}
