import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ConversationTypeForSchema } from '../types';

@Schema({ timestamps: true })
export class Conversation implements ConversationTypeForSchema {
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    participants: Array<Types.ObjectId>;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
    messages: Array<Types.ObjectId>;

    @Prop({ type: Types.ObjectId, ref: 'Message' })
    lastMessage: Types.ObjectId;

    @Prop({ type: Date, required: true, default: () => new Date() })
    lastMessageSentAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);