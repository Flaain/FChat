import mongoose, { Types } from 'mongoose';

export interface SessionDocument {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    createdAt: Date;
    expiresAt?: Date;
}

export interface DropSessionParams {
    initiatorUserId: Types.ObjectId | string;
    initiatorSessionId: string;
    sessionId: string;
}