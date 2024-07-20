import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTP } from './schemas/otp.schema';

@Injectable()
export class OTPService {
    constructor(@InjectModel(OTP.name) private readonly otpModel: Model<OTP>) {}

    create = async ({ email, type, expiresAt }: Omit<OTP, 'createdAt' | 'otp'>) => {
        const generatedOTP = Math.floor(100000 + Math.random() * 900000);
    };
}