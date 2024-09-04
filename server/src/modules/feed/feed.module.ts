import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { ConversationModule } from '../conversation/conversation.module';
import { GroupModule } from '../group/group.module';
import { ParticipantModule } from '../participant/participant.module';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Feed, FeedSchema } from './schemas/feed.schema';

@Module({
    imports: [
        ConversationModule,
        GroupModule,
        ParticipantModule,
        UserModule,
        MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }]),
    ],
    controllers: [FeedController],
    providers: [FeedService],
    exports: [FeedService],
})
export class FeedModule {}