import { IUser } from 'src/modules/user/types';
import { Message } from "../schemas/message.schema"
import { Document, SchemaTimestampsConfig, Types } from 'mongoose';
import { MessageSendDTO } from '../dtos/message.send.dto';
import { MessageDeleteDTO } from '../dtos/message.delete.dto';
import { MessageEditDTO } from '../dtos/message.edit.dto';

export interface IMessage {
    _id: Types.ObjectId;
    sender: Types.ObjectId
    hasBeenEdited: boolean;
    hasBeenRead: boolean;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMessageService {
    send(dto: SendMessageType): Promise<Message & { conversationId: Types.ObjectId }>;
}

export type MessageDocument = Message & Document & SchemaTimestampsConfig;

export type SendMessageType = MessageSendDTO & { recipientId: string; initiatorId: Types.ObjectId };
export type EditMessageType = MessageEditDTO & { initiatorId: Types.ObjectId, messageId: string };
export type DeleteMessageType = MessageDeleteDTO & { messageId: string; initiatorId: Types.ObjectId };
