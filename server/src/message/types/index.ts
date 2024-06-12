import { Document, SchemaTimestampsConfig, Types } from 'mongoose';
import { MessageSendDTO } from '../dtos/message.send.dto';
import { Message } from '../schemas/message.schema';
import { MessageDeleteDTO } from '../dtos/message.delete.dto';
import { MessageEditDTO } from '../dtos/message.edit.dto';

export interface IMessageForSchema {
    sender: Types.ObjectId;
    text: string;
    hasBeenRead: boolean;
    hasBeenEdited: boolean;
}

export interface IMessageService {
    send(dto: SendMessageType): Promise<MessageDocumentType & { conversationId: Types.ObjectId }>;
}

export type MessageDocumentType = Message & Document & SchemaTimestampsConfig;

export type SendMessageType = MessageSendDTO & { recipientId: string; initiatorId: Types.ObjectId };
export type EditMessageType = MessageEditDTO & { initiatorId: Types.ObjectId, messageId: string };
export type DeleteMessageType = MessageDeleteDTO & { messageId: string; initiatorId: Types.ObjectId };
