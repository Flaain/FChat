import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { VerificationCodeDocument, VerificationCodeType } from '../types';
import { DatesService } from 'src/utils/dates/dates.service';

@Schema({ timestamps: true })
export class VerificationCode implements VerificationCodeDocument {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true })
    userId: mongoose.Types.ObjectId;

    @Prop({ type: String, required: true })
    type: VerificationCodeType;

    @Prop({ type: Date })
    createdAt?: Date;

    @Prop({ type: Date, required: true, default: DatesService.oneWeekFromNow })
    expiresAt?: Date;
}

export const VerificationCodeSchema = SchemaFactory.createForClass(VerificationCode);