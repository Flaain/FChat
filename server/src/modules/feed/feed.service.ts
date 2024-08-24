import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ConversationService } from '../conversation/conversation.service';
import { GroupService } from '../group/group.service';
import { ParticipantService } from '../participant/participant.service';
import { Pagination } from 'src/utils/types';
import { UserService } from '../user/user.service';

@Injectable()
export class FeedService {
    constructor(
        private readonly userService: UserService,
        private readonly conversationService: ConversationService,
        private readonly groupService: GroupService,
        private readonly participantService: ParticipantService,
    ) {}

    search = async ({ initiatorId, query }: Pick<Pagination, 'query'> & { initiatorId: Types.ObjectId }) => {
        return Promise.all([
            this.userService.find(
                {
                    $or: [{ login: { $regex: query, $options: 'i' } }, { name: { $regex: query, $options: 'i' } }],
                    _id: { $ne: initiatorId },
                    isDeleted: false,
                    isPrivate: false,
                },
                { _id: 1, name: 1, login: 1, isOfficial: 1 },
                { sort: { createdAt: -1 } },
            ),
            this.groupService.find(
                {
                    $or: [{ login: { $regex: query, $options: 'i' } }, { name: { $regex: query, $options: 'i' } }],
                    isPrivate: false,
                },
                { _id: 1, name: 1, login: 1, isOfficial: 1 },
                { sort: { createdAt: -1 } },
            ),
        ]);
    };

    getFeed = async ({
        initiatorId,
        cursor,
        existingIds = [],
    }: {
        initiatorId: Types.ObjectId;
        cursor?: string;
        existingIds?: Array<string>;
    }) => {
        const BATCH_SIZE = 10;
        let nextCursor: string | null = null;

        const participants = await this.participantService.find({ userId: initiatorId });

        const groups = (
            await this.groupService.find(
                { _id: { $in: participants.map((participant) => participant.groupId), $nin: existingIds } },
                {
                    _id: 1,
                    name: 1,
                    login: 1,
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
                            populate: { path: 'userId', model: 'User', select: 'name' },
                        },
                    },
                },
            )
        ).map((group) => ({ ...group.toObject(), type: 'group' }));

        const chats = (
            await this.conversationService.find(
                { _id: { $nin: existingIds }, participants: { $in: initiatorId } },
                { lastMessage: 1, participants: 1, lastMessageSentAt: 1 },
                {
                    populate: [
                        {
                            path: 'participants',
                            model: 'User',
                            select: 'login name isOfficial isDeleted presence',
                            match: { _id: { $ne: initiatorId } },
                        },
                        {
                            path: 'lastMessage',
                            model: 'Message',
                            populate: { path: 'sender', model: 'User', select: 'name' },
                        },
                    ],
                },
            )
        ).map((chat) => {
            const { participants, ...rest } = chat.toObject();

            return { ...rest, recipient: participants[0], type: 'conversation' };
        });

        const feed = [...groups, ...chats]
            .filter((chat) => !cursor || chat.lastMessageSentAt < new Date(cursor))
            .sort((a, b) => new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime())
            .slice(0, BATCH_SIZE);

        feed.length === BATCH_SIZE && (nextCursor = feed[BATCH_SIZE - 1].lastMessageSentAt.toISOString());

        return { feed, nextCursor };
    };
}