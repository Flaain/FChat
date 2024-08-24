import { Document, FilterQuery, ProjectionType, QueryOptions, SchemaTimestampsConfig, Types } from 'mongoose';
import { ConversationCreateDTO } from '../dtos/conversation.create.dto';
import { Conversation } from '../schemas/conversation.schema';
import { RequestWithUser } from 'src/utils/types';
import { UserDocument } from 'src/modules/user/types';
import { User } from 'src/modules/user/schemas/user.schema';

export interface IConversation {
    _id: Types.ObjectId;
    lastMessageSentAt?: Date;
    lastMessage?: Types.ObjectId;
    participants: Array<Types.ObjectId>;
    messages?: Array<Types.ObjectId>;
}

export type ConversationDocument = Conversation & Document & SchemaTimestampsConfig;

export interface GetConversationReturn {
    conversation: {
        _id?: Types.ObjectId;
        messages: Array<Types.ObjectId>;
        recipient: Omit<User, 'password' | 'birthDate'>;
    };
    nextCursor: string | null;
}

export interface CreateConversationReturn {
    _id: Types.ObjectId;
    lastMessageSentAt: Date;
    recipient: Omit<User, 'password' | 'birthDate'>;
}

export interface IConversationService {
    createConversation: (
        params: ConversationCreateDTO & { initiatorId: Types.ObjectId },
    ) => Promise<CreateConversationReturn>;
    getConversation: (params: {
        initiator: UserDocument;
        recipientId: string;
        cursor?: string;
    }) => Promise<GetConversationReturn>;
    deleteConversation: (params: {
        initiatorId: Types.ObjectId;
        recipientId: string;
    }) => Promise<{ _id: Types.ObjectId; recipientId: string }>;
}

export interface IConversationController {
    create: (req: RequestWithUser, dto: ConversationCreateDTO) => Promise<CreateConversationReturn>;
    delete: (req: RequestWithUser, id: string) => Promise<{ conversationId: Types.ObjectId }>;
    getConversation(req: RequestWithUser, recipientId: string, cursor?: string): Promise<GetConversationReturn>;
}
