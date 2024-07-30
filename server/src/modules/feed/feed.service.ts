import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ConversationService } from '../conversation/conversation.service';
import { GroupService } from '../group/group.service';
import { ParticipantService } from '../participant/participant.service';

@Injectable()
export class FeedService {
    constructor(
        private readonly conversationService: ConversationService,
        private readonly groupService: GroupService,
        private readonly participantService: ParticipantService,
    ) {}

    getFeed = async ({ initiatorId, cursor }: { initiatorId: Types.ObjectId; cursor?: string }) => {
        const BATCH_SIZE = 10;
        let nextCursor: string | null = null;

        const participants = await this.participantService.findManyByPayload({ userId: initiatorId });
        const groups = await this.groupService.findManyByPayload(
            { _id: { $in: participants.map((participant) => participant.groupId) } },
            {
                _id: 1,
                displayName: 1,
                lastMessage: 1,
                lastMessageSentAt: 1,
            },
            {
                populate: {
                    path: 'lastMessage',
                    model: 'GroupMessage',
                    populate: { 
                        path: 'sender', 
                        model: 'Participant', 
                        populate: { path: 'userId', model: 'User', select: 'name' } 
                    },
                },
            },
        );
        const chats = await this.conversationService.findManyByPayload(
            { participants: { $in: initiatorId } },
            { lastMessage: 1, participants: 1, lastMessageSentAt: 1 },
            {
                populate: [
                    {
                        path: 'participants',
                        model: 'User',
                        select: 'login name email isOfficial isDeleted',
                        match: { _id: { $ne: initiatorId } },
                    },
                    {
                        path: 'lastMessage',
                        model: 'Message',
                        populate: { path: 'sender', model: 'User', select: 'name' },
                    },
                ],
            },
        );

        const feed = [...groups, ...chats]
            .filter((chat) => !cursor || chat.lastMessageSentAt < new Date(cursor))
            .sort((a, b) => new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime())
            .slice(0, BATCH_SIZE)
            .map((chat) => ({ ...chat.toObject(), type: chat.collection.name === 'groups' ? 'group' : 'conversation' }));

        feed.length === BATCH_SIZE && (nextCursor = feed[BATCH_SIZE - 1].lastMessageSentAt.toISOString());

        return { feed, nextCursor };
    };
}