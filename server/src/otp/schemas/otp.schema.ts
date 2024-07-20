import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DatesService } from 'src/utils/dates/dates.service';
import { OTPDocument, OTPType } from '../types';

@Schema({ collection: 'verification_codes', timestamps: true })
export class OTP implements OTPDocument {
    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: String, required: true })
    otp: string;

    @Prop({ type: String, enum: OTPType, required: true })
    type: OTPType;

    @Prop({ type: Date, expires: '2m' }) // change to 7d after tests completed
    createdAt?: Date;

    @Prop({ type: Date, required: true, default: DatesService.oneWeekFromNow })
    expiresAt?: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);