import { getSignedUrl } from 'src/utils/helpers/getSignedUrl';
import { FEED_TYPE, FeedHandlers } from '../types';

export const feedHandlers: Record<FEED_TYPE, FeedHandlers> = {
    Conversation: {
        populate: (initiatorId) => ({
            path: 'item',
            select: 'participants lastMessage',
            populate: [
                {
                    path: 'participants',
                    model: 'User',
                    select: 'login name isOfficial isDeleted presence avatar',
                    populate: { path: 'avatar', model: 'File', select: 'key' },
                    match: { _id: { $ne: initiatorId } },
                },
                {
                    path: 'lastMessage',
                    model: 'Message',
                    select: 'text sender createdAt',
                    populate: { path: 'sender', model: 'User', select: 'name' },
                },
            ],
        }),
        canPreSignUrl: (doc) => !!doc.item.participants[0].avatar,
        getPreSignedUrl: (doc, client) => getSignedUrl(client, doc.item.participants[0].avatar.key),
        returnObject: ({ item: { participants, ...restItem }, ...doc }, url) => ({ ...doc, ...restItem, recipient: { ...participants[0], avatar: url } }),
    },
    Group: {
        populate: () => ({ path: 'item' }),
        canPreSignUrl: (doc) => !!doc.item.avatar,
        getPreSignedUrl: async () => '#',
        returnObject: (doc, url) => ({ ...doc.item, avatar: url }),
    }
};
