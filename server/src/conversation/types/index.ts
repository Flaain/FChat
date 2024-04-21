import { Types } from "mongoose";

export interface ConversationTypeForSchema {
    name?: string;
    participants: Array<Types.ObjectId>;
    messages: Array<Types.ObjectId>;
}