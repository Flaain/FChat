import { FilterQuery, Types } from 'mongoose';
import { OTP } from '../schemas/otp.schema';
import { z } from 'zod';
import { OtpCreateSchema } from '../schemas/otp.create.schema';

export enum OtpType {
    EMAIL_VERIFICATION = 'email_verification',
    PASSWORD_RESET = 'password_reset',
}

export interface OtpDocument {
    email: string;
    otp: string;
    type: OtpType;
    expiresAt?: Date;
    createdAt?: Date;
}

export interface IOtpService {
    create: (dto: Pick<OtpDocument, 'email' | 'type'>) => Promise<{ retryDelay?: number }>;
    exists: (query: FilterQuery<OTP>) => Promise<{ _id: Types.ObjectId }>;
    findOneAndDelete: (query: FilterQuery<OTP>) => Promise<{ _id: Types.ObjectId }>;
}

export interface IOtpController {
    create: (dto: z.infer<typeof OtpCreateSchema>) => Promise<{ retryDelay?: number }>;
}