import { Model, Types } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ConversationService } from '../conversation/conversation.service';
import { GroupService } from '../group/group.service';
import { ParticipantService } from '../participant/participant.service';
import { Pagination, Providers } from 'src/utils/types';
import { UserService } from '../user/user.service';
import { S3Client } from '@aws-sdk/client-s3';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from 'src/utils/services/base/base.service';
import { FeedDocument, FeedHandlers, GetFeedParams } from './types';
import { Feed } from './schemas/feed.schema';
import { feedHandlers } from './constants';

@Injectable()
export class FeedService extends BaseService<FeedDocument, Feed> {
    constructor(
        private readonly userService: UserService,
        private readonly conversationService: ConversationService,
        private readonly groupService: GroupService,
        private readonly participantService: ParticipantService,
        @Inject(Providers.S3_CLIENT) private readonly s3: S3Client,
        @InjectModel(Feed.name) private readonly feedModel: Model<FeedDocument>,
    ) {
        super(feedModel);
    }

    search = async ({ initiatorId, query }: Pick<Pagination, 'query'> & { initiatorId: Types.ObjectId }) => {
        return Promise.all([
            this.userService.find({
                filter: {
                    $or: [{ login: { $regex: query, $options: 'i' } }, { name: { $regex: query, $options: 'i' } }],
                    _id: { $ne: initiatorId },
                    isDeleted: false,
                    isPrivate: false,
                },
                projection: { _id: 1, name: 1, login: 1, isOfficial: 1 },
                options: { sort: { createdAt: -1 } },
            }),
            this.groupService.find({
                filter: {
                    $or: [{ login: { $regex: query, $options: 'i' } }, { name: { $regex: query, $options: 'i' } }],
                    isPrivate: false,
                },
                projection: { _id: 1, name: 1, login: 1, isOfficial: 1 },
                options: { sort: { createdAt: -1 } },
            }),
        ]);
    };

    getFeed = async ({ initiatorId, cursor, existingIds = [] }: GetFeedParams) => {
        const BATCH_SIZE = 10;
        let nextCursor: string | null = null;

        const feed = await this.find({
            filter: { _id: { $nin: existingIds }, user: initiatorId, ...(cursor && { lastActionAt: { $lt: cursor } }) },
            projection: { item: 1, type: 1, lastActionAt: 1 },
            options: { limit: BATCH_SIZE, sort: { lastActionAt: -1 } },
        });

        const feedWithPresignedUrls = await Promise.all(feed.map(async (item: FeedDocument) => {
            const itemHandlers = feedHandlers[item.type];
            const populatedItem = await item.populate(itemHandlers.populate(initiatorId));

            if (!itemHandlers.canPreSignUrl(item)) return itemHandlers.returnObject(populatedItem.toObject());

            const url = await itemHandlers.getPreSignedUrl(item, this.s3);

            return itemHandlers.returnObject(populatedItem.toObject(), url);
        }));

        feed.length === BATCH_SIZE && (nextCursor = feed[BATCH_SIZE - 1].lastActionAt.toISOString());

        return { feed: feedWithPresignedUrls, nextCursor };
    };
}