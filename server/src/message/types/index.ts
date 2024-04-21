import { Types } from "mongoose";

export interface IMessageForSchema {
    sender: Types.ObjectId;
    text: string;
    hasBeenRead: boolean;
    hasBeenEdited: boolean;
}