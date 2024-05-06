import { Document, Types } from 'mongoose';
import { ConversationCreateDTO } from '../dtos/conversation.create.dto';
import { UserDocumentType } from 'src/user/types';
import { Conversation } from '../schemas/conversation.schema';

export interface ConversationTypeForSchema {
    name?: string;
    participants: Array<Types.ObjectId>;
    messages: Array<Types.ObjectId>;
}

export type CreateConversationArgs = ConversationCreateDTO & { initiatorId: Types.ObjectId };
export type CreateConversationReturn = Promise<Omit<Document<unknown, {}, Conversation> & Conversation & { _id: Types.ObjectId }, never>>;

export interface IConversationService {
    createConversation(data: CreateConversationArgs): CreateConversationReturn;
}
