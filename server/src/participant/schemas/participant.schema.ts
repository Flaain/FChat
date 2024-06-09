import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Participant {
    @Prop({ type: { type: Types.ObjectId, ref: 'Group' } })
    group: Types.ObjectId;

    @Prop({ type: { type: Types.ObjectId, ref: 'User' } })
    user: Types.ObjectId;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);