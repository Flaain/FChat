import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Participant {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true })
    groupId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: mongoose.Types.ObjectId;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);