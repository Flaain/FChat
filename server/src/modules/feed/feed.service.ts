import { Types } from 'mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConversationService } from '../conversation/conversation.service';
import { GroupService } from '../group/group.service';
import { ParticipantService } from '../participant/participant.service';
import { Pagination } from 'src/utils/types';
import { searchSchema } from 'src/utils/schemas/search.schema';
import { UserService } from '../user/user.service';
import { Group } from '../group/schemas/group.schema';
import { User } from '../user/schemas/user.schema';
import { AppException } from 'src/utils/exceptions/app.exception';
import { noSearchResults } from 'src/utils/constants';

@Injectable()
export class FeedService {
    constructor(
        private readonly userService: UserService,
        private readonly conversationService: ConversationService,
        private readonly groupService: GroupService,
        private readonly participantService: ParticipantService,
    ) {}

    private readonly types: Record<string, string> = {
        [`${User.name}s`.toLowerCase()]: 'user',
        [`${Group.name}s`.toLowerCase()]: 'group',
    }

    search = async ({ initiatorId, query, page = 0, limit = 10 }: Pagination & { initiatorId: Types.ObjectId }) => {
        const parsedQuery = searchSchema.parse({ query, page, limit }, { path: ['query'] });
        
        const [users, groups] = await Promise.all([
            this.userService.findManyByPayload(
                {
                    $or: [
                        { login: { $regex: parsedQuery.query, $options: 'i' } },
                        { name: { $regex: parsedQuery.query, $options: 'i' } },
                    ],
                    _id: { $ne: initiatorId },
                    isDeleted: false,
                    isPrivate: false,
                },
                { _id: 1, name: 1, login: 1, isOfficial: 1 },
                { sort: { createdAt: -1 } },
            ),
            
            this.groupService.findManyByPayload(
                {
                    $or: [
                        { login: { $regex: parsedQuery.query, $options: 'i' } },
                        { name: { $regex: parsedQuery.query, $options: 'i' } },
                    ],
                    isPrivate: false,
                },
                { _id: 1, name: 1, login: 1, isOfficial: 1 },
                { sort: { createdAt: -1 } },
            ),
        ]);

        const total_items = users.length + groups.length;

        if (!total_items) throw new AppException(noSearchResults, HttpStatus.NOT_FOUND);

        return {
            total_items,
            current_page: parsedQuery.page,
            total_pages: Math.ceil(total_items / parsedQuery.limit),
            remaining_items: Math.max(total_items - (page + 1) * parsedQuery.limit, 0),
            items: [...users, ...groups]
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .slice(page * parsedQuery.limit, page * parsedQuery.limit + parsedQuery.limit)
                .map((item) => ({ ...item.toObject(), type: this.types[item.collection.name] }))
        };
    }
 
    getFeed = async ({ initiatorId, cursor, existingIds = [] }: { initiatorId: Types.ObjectId; cursor?: string, existingIds?: Array<string> }) => {
        const BATCH_SIZE = 10;
        let nextCursor: string | null = null;

        const participants = await this.participantService.findManyByPayload({ userId: initiatorId });
        
        const groups = (await this.groupService.findManyByPayload(
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
                        populate: { path: 'userId', model: 'User', select: 'name' } 
                    },
                },
            },
        )).map((group) => ({ ...group.toObject(), type: 'group' }));

        const chats = (await this.conversationService.findManyByPayload(
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
        )).map((chat) => {
            const { participants, ...rest } = chat.toObject();

            return { ...rest, recipient: participants[0], type: 'conversation' }
        });
        
        const feed = [...groups, ...chats]
            .filter((chat) => !cursor || chat.lastMessageSentAt < new Date(cursor))
            .sort((a, b) => new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime())
            .slice(0, BATCH_SIZE);

        feed.length === BATCH_SIZE && (nextCursor = feed[BATCH_SIZE - 1].lastMessageSentAt.toISOString());

        return { feed, nextCursor };
    };
}