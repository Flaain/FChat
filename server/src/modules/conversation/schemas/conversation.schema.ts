import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IConversation } from '../types';

@Schema({ timestamps: true })
export class Conversation implements Omit<IConversation, '_id'> {
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    participants: Array<mongoose.Types.ObjectId>;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
    messages: Array<mongoose.Types.ObjectId>;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
    lastMessage: mongoose.Types.ObjectId;

    @Prop({ type: Date, required: true, default: () => new Date() })
    lastMessageSentAt: Date;

    @Prop({ type: String, required: true })
    publicKey: string;

    @Prop({ type: String, required: true })
    privateKey: string;

    @Prop({ type: Date, default: () => new Date() })
    createdAt: Date;

    @Prop({ type: Date, default: () => new Date() })
    updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);