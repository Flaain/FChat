import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRegister } from '../types';

@Schema({ timestamps: true })
export class User implements UserRegister {
    @Prop({ type: String, required: true, unique: true })
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
    verified: boolean;

    @Prop({ type: Boolean, default: false })
    official: boolean;

    @Prop({ type: Date, required: true, default: () => new Date() })
    lastSeenAt: Date;

    @Prop({ type: String })
    status?: string;

    @Prop({ type: Boolean, default: false })
    deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);