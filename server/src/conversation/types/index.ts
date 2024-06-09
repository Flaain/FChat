import { Document, SchemaTimestampsConfig, Types } from 'mongoose';
import { ConversationCreateDTO } from '../dtos/conversation.create.dto';
import { Conversation } from '../schemas/conversation.schema';

export interface ConversationTypeForSchema {
    name?: string;
    participants: Array<Types.ObjectId>;
    messages: Array<Types.ObjectId>;
}

export type ConversationDocument = Conversation & Document & SchemaTimestampsConfig;
export type CreateConversationArgs = ConversationCreateDTO & { initiatorId: Types.ObjectId };

export interface IConversationService {
    createConversation(data: CreateConversationArgs): Promise<ConversationDocument>;
}
