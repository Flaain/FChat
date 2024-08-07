import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Conversation, ConversationSchema } from '../conversation/schemas/conversation.schema';
import { GroupModule } from '../group/group.module';
import { BcryptModule } from 'src/utils/services/bcrypt/bcrypt.module';
import { SessionModule } from '../session/session.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Conversation.name, schema: ConversationSchema },
        ]),
        GroupModule,
        BcryptModule,
        SessionModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}