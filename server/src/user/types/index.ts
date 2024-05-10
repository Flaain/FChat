import { Document, FlattenMaps, Types } from 'mongoose';
import { User as UserModel } from '../schemas/user.schema';
import { Conversation } from 'src/conversation/schemas/conversation.schema';

export interface IUser {
    conversations: Array<Omit<FlattenMaps<Conversation> & { _id: Types.ObjectId }, never>>;
    accessToken: string;
    password: string;
    expiersIn: string;
    name: string;
    email: string;
    birthDate: Date;
    isPrivate: boolean;
    lastSeen: Date;
    _id: Types.ObjectId;
}

export interface UserRegister extends Pick<IUser, 'email' | 'name' | 'birthDate'> {
    password: string;
}

export type CreateUserType = Omit<IUser, "accessToken" | "expiersIn" | "password" | "conversations">;
export type UserProfileType = Omit<IUser, "accessToken" | "expiersIn" | "password">;
export type UserDocumentType = Document<unknown, {}, UserModel> & UserModel & { _id: Types.ObjectId };