import mongoose from "mongoose";

export interface SessionDocument {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    createdAt: Date;
    expiresAt?: Date;
}