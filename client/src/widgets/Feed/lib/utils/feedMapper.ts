import { FeedItemProps } from "@/features/FeedItem/model/types";
import { ConversationFeed, FeedTypes, GroupFeed, PRESENCE, UserFeed } from "@/shared/model/types";

const typeToMapper: Record<FeedTypes, (item: any) => FeedItemProps> = {
    [FeedTypes.CONVERSATION]: (item: ConversationFeed) => ({
        _id: item._id,
        login: item.recipient.login,
        name: item.recipient.name,
        lastMessage: item.lastMessage,
        to: `conversation/${item.recipient._id}`,
        type: item.type,
        draftId: item.recipient._id,
        isOfficial: item.recipient.isOfficial,
        isOnline: item.recipient.presence === PRESENCE.ONLINE,
    }),
    [FeedTypes.GROUP]: (item: GroupFeed) => ({
        _id: item._id,
        login: item.login,
        name: item.name,
        lastMessage: item.lastMessage,
        to: `group/${item._id}`,
        type: item.type,
        draftId: item._id,
        isOfficial: item.isOfficial,
    }),
    [FeedTypes.USER]: (item: UserFeed) => ({
        _id: item._id,
        login: item.login,
        name: item.name,
        to: `conversation/${item._id}`,
        type: item.type,
        draftId: item._id,
        isOfficial: item.isOfficial,
    }),
};

export const feedMapper = (items: Array<ConversationFeed | GroupFeed | UserFeed>) => items.map((item) => typeToMapper[item.type](item));
