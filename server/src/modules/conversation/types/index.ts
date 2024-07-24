import { Document, FilterQuery, ProjectionType, QueryOptions, SchemaTimestampsConfig, Types } from 'mongoose';
import { ConversationCreateDTO } from '../dtos/conversation.create.dto';
import { Conversation } from '../schemas/conversation.schema';
import { RequestWithUser } from 'src/utils/types';
import { UserDocument } from 'src/modules/user/types';
import { User } from 'src/modules/user/schemas/user.schema';

export interface IConversation {
    _id: Types.ObjectId;
    lastMessageSentAt: Date;
    lastMessage?: Types.ObjectId;
    participants: Array<Types.ObjectId>;
    messages: Array<Types.ObjectId>;
}

export type ConversationDocument = Conversation & Document & SchemaTimestampsConfig;

export interface GetConversationsReturn {
    conversations: Array<Omit<IConversation, 'messages'>>;
    nextCursor: string | null;
}

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
    createConversation: (params: ConversationCreateDTO & { initiatorId: Types.ObjectId }) => Promise<CreateConversationReturn>;
    getConversations: (params: { initiatorId: Types.ObjectId; cursor?: string }) => Promise<GetConversationsReturn>;
    getConversation: (params: { initiator: UserDocument; recipientId: string; cursor?: string }) => Promise<GetConversationReturn>;
    deleteConversation: (params: { initiatorId: Types.ObjectId; conversationId: string }) => Promise<{ _id: Types.ObjectId }>;
    findOneByPayload: (
        payload: FilterQuery<Conversation>, 
        projection?: ProjectionType<Conversation>, 
        options?: QueryOptions<Conversation>
    ) => Promise<IConversation | null>;
    findManyByPayload: (
        payload: FilterQuery<Conversation>, 
        projection?: ProjectionType<Conversation>, 
        options?: QueryOptions<Conversation>
    ) => Promise<Array<IConversation>>;
}

export interface IConversationController {
    create: (req: RequestWithUser, dto: ConversationCreateDTO) => Promise<CreateConversationReturn>;
    delete: (req: RequestWithUser, id: string) => Promise<{ _id: Types.ObjectId }>;
    getConversations(req: RequestWithUser, cursor?: string): Promise<GetConversationsReturn>;
    getConversation(req: RequestWithUser, recipientId: string, cursor?: string): Promise<GetConversationReturn>;
}
