import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '../types';

@Schema({ timestamps: true })
export class User implements Omit<IUser, '_id'> {
    @Prop({ type: String, required: true, unique: true })
    login: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: Date, required: true })
    birthDate: Date;

    @Prop({ type: Boolean, required: true, default: false })
    isPrivate: boolean;

    @Prop({ type: Boolean, default: false })
    isOfficial: boolean;

    @Prop({ type: Date, required: true, default: () => new Date() })
    lastSeenAt: Date;

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;

    @Prop({ type: String })
    status?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);