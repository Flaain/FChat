import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ConversationTypeForSchema } from '../types';

@Schema({ timestamps: true })
export class Conversation implements ConversationTypeForSchema {
    @Prop()
    name?: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    participants: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
    messages: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: 'User' })
    creator: Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);