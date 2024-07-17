import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationCode } from './schemas/verification.schema';
import { Model } from 'mongoose';
import { VerificationCodeDocument } from './types';

@Injectable()
export class VerificationService {
    constructor(@InjectModel(VerificationCode.name) private readonly verificationCodeModel: Model<VerificationCode>) {}

    create = ({ userId, type, expiresAt }: Omit<VerificationCodeDocument, 'createdAt'>) => this.verificationCodeModel.create({ userId, type, expiresAt });
}
