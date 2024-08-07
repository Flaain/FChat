import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { ConversationModule } from '../conversation/conversation.module';
import { GroupModule } from '../group/group.module';
import { ParticipantModule } from '../participant/participant.module';

@Module({
    imports: [ConversationModule, GroupModule, ParticipantModule],
    controllers: [FeedController],
    providers: [FeedService],
})
export class FeedModule {}