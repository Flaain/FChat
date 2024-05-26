import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRegister } from '../types';

@Schema({ timestamps: true })
export class User implements UserRegister {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    birthDate: Date;

    @Prop({ required: true, default: false })
    isPrivate: boolean;

    @Prop()
    isVerified?: boolean;

    @Prop({ required: true, default: Date.now() })
    lastSeen: Date;

    @Prop()
    status?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);