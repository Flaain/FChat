import { Types } from "mongoose";

export interface IGroup {
    name: string;
    participants: Array<Types.ObjectId>;
    messages: Array<Types.ObjectId>;
    owner: Types.ObjectId;
    displayName: string;
    isPrivate?: boolean;
    official?: boolean;
    lastMessage: Types.ObjectId;
}