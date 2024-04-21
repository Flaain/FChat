import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { IMessageForSchema } from '../types';

@Schema({ timestamps: true })
export class Message implements IMessageForSchema {
    @Prop({ required: true, ref: 'User' })
    sender: Types.ObjectId;

    @Prop({ required: true })
    text: string;

    @Prop({ required: true, default: false })
    hasBeenRead: boolean;

    @Prop({ required: true, default: false })
    hasBeenEdited: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);