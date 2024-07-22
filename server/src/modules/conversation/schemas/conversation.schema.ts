import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ConversationTypeForSchema } from '../types';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Conversation implements ConversationTypeForSchema {
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    participants: Array<mongoose.Types.ObjectId>;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
    messages: Array<mongoose.Types.ObjectId>;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
    lastMessage: mongoose.Types.ObjectId;

    @Prop({ type: Date, required: true, default: () => new Date() })
    lastMessageSentAt: Date;

    @Prop({ type: Date, default: () => new Date() })
    createdAt: Date;

    @Prop({ type: Date, default: () => new Date() })
    updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);