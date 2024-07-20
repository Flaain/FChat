import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SessionDocument } from '../types';
import { DatesService } from 'src/utils/dates/dates.service';

@Schema({ timestamps: true })
export class Session implements SessionDocument {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true })
    userId: mongoose.Types.ObjectId;

    @Prop({ type: String })
    userAgent?: string;

    @Prop({ type: Date, required: true, default: DatesService.oneMonthFromNow })
    expiresAt?: Date;

    @Prop({ type: Date, expires: '30d' })
    createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);