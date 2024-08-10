import { Types } from "mongoose";

export interface IGroup {
    login: string;
    participants: Array<Types.ObjectId>;
    messages: Array<Types.ObjectId>;
    owner: Types.ObjectId;
    name: string;
    isPrivate: boolean;
    isOfficial: boolean;
    lastMessage: Types.ObjectId;
}