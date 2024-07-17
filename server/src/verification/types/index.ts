import { Types } from "mongoose";

export enum VerificationCodeType {
    EMAIL_VERIFICATION = 'email_verification',
    PASSWORD_RESET = 'password_reset',
}

export interface VerificationCodeDocument {
    userId: Types.ObjectId;
    type: VerificationCodeType;
    expiresAt?: Date;
    createdAt?: Date;
}