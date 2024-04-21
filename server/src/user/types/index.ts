import { Document, Types } from "mongoose";
import { User as UserModel } from "../schemas/user.schema";
import { Conversation } from "src/utils/types";

export interface User {
    id: string;
    name: string;
    email: string;
    birthDate: Date;
    conversations: Array<Conversation>;
}

export interface UserRegister extends Pick<User, 'email' | 'name' | 'birthDate'> {
    password: string;
}

export type UserDocumentType = Document<unknown, {}, UserModel> & UserModel & { _id: Types.ObjectId }