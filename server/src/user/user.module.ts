import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Conversation, ConversationSchema } from 'src/conversation/schemas/conversation.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Conversation.name, schema: ConversationSchema }])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}