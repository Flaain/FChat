import { Document, SchemaTimestampsConfig, Types } from 'mongoose';
import { User } from '../schemas/user.schema';

export interface IUser {
    _id: Types.ObjectId;
    accessToken: string;
    password: string;
    expiersIn: string;
    name: string;
    email: string;
    birthDate: Date;
    private: boolean;
    lastSeenAt: Date;
    deleted: boolean;
    official: boolean;
}

export interface UserRegister extends Pick<IUser, 'email' | 'name' | 'birthDate'> {
    password: string;
}

export type CreateUserType = Omit<IUser, "accessToken" | "expiersIn" | "password" | "conversations">;
export type UserProfileType = Omit<IUser, "accessToken" | "expiersIn" | "password">;
export type UserDocument = User & Document & SchemaTimestampsConfig;