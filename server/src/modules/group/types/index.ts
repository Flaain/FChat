import { Types } from 'mongoose';

export interface IGroup {
    login: string;
    participants: Array<Types.ObjectId>;
    messages: Array<Types.ObjectId>;
    owner: Types.ObjectId;
    name: string;
    isPrivate: boolean;
    isOfficial: boolean;
    lastMessage: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    lastMessageSentAt: Date;
}

export interface InviteInterface {
    code: string;
    groupId: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt: Date;
    expiresAt: Date;
}

export enum GroupView {
    PARTICIPANT = 'participant',
    REQUEST = 'request',
    JOIN = 'join',
    GUEST = 'guest',
}