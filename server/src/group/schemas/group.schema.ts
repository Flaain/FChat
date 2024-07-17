import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IGroup } from '../types';

@Schema({ timestamps: true })
export class Group implements IGroup {
    @Prop({ type: String, required: true, unique: true })
    name: string;

    @Prop({ type: String, required: true })
    displayName: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }] })
    participants: Array<mongoose.Types.ObjectId>;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupMessage' }] })
    messages: Array<mongoose.Types.ObjectId>;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'GroupMessage' })
    lastMessage: mongoose.Types.ObjectId;

    @Prop({ type: Date })
    lastMessageSentAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    creator: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true })
    owner: mongoose.Types.ObjectId;

    @Prop({ type: Boolean, default: false })
    isPrivate?: boolean;

    @Prop({ type: Boolean, default: false })
    official?: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);