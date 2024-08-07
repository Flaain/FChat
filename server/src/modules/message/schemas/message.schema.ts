import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IMessage } from '../types';

@Schema({ timestamps: true })
export class Message implements Omit<IMessage, '_id'> {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    sender: mongoose.Types.ObjectId;

    @Prop({ required: true })
    text: string;

    @Prop({ type: String, required: true })
    symKey: string;

    @Prop({ type: String, required: true })
    iv: string;

    @Prop({ required: true, default: false })
    hasBeenRead: boolean;

    @Prop({ required: true, default: false })
    hasBeenEdited: boolean;

    @Prop({ type: Date, default: () => new Date() })
    createdAt: Date;

    @Prop({ type: Date, default: () => new Date() })
    updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);