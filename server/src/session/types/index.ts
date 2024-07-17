import mongoose from "mongoose";

export interface SessionDocument {
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    createdAt: Date;
    expiresAt?: Date;
}