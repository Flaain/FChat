import { Document, Types } from 'mongoose';
import { MessageSendDTO } from '../dtos/message.send.dto';
import { Message } from '../schemas/message.schema';
import { MessageDeleteDTO } from '../dtos/message.delete.dto';

export interface IMessageForSchema {
    sender: Types.ObjectId;
    text: string;
    hasBeenRead: boolean;
    hasBeenEdited: boolean;
}

export interface IMessageService {
    send(dto: SendMessageType): Promise<MessageDocumentType>;
}

export type MessageDocumentType = Promise<Omit<Document<unknown, {}, Message> & Message & { _id: Types.ObjectId }, never>>;
export type SendMessageType = MessageSendDTO & { conversationId: string; initiatorId: Types.ObjectId };
export type DeleteMessageType = MessageDeleteDTO & { messageId: string; initiatorId: Types.ObjectId };
