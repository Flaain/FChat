import { ConversationFeed, FeedItem, FeedTypes, GroupFeed, UserFeed } from '@/shared/model/types';
import { ConversationItem, GroupItem, UserItem } from '@/widgets/Feed';

export const localFilters: Record<Exclude<FeedTypes, 'User'>, (item: FeedItem, value: string) => boolean> = {
    Conversation: (item, value) =>
        (item as ConversationFeed).recipient.name.toLowerCase().includes(value) ||
        (item as ConversationFeed).recipient.login.toLowerCase().includes(value),
    Group: (item, value) =>
        (item as GroupFeed).name.toLowerCase().includes(value) ||
        (item as GroupFeed).login.toLowerCase().includes(value)
};

export const globalFilters: Record<Exclude<FeedTypes, 'Conversation'>, (item: FeedItem, localResults: Array<ConversationFeed | GroupFeed>) => boolean> = {
    User: (item, localResults) => localResults.some((localItem) => localItem.type === FeedTypes.CONVERSATION && localItem.recipient._id === item._id),
    Group: (item, localResults) => localResults.some((localItem) => localItem._id === item._id)
};

export const feedItems: Record<FeedTypes, (item: FeedItem) => React.ReactNode> = {
    Conversation: (item) => <ConversationItem key={item._id} conversation={item as ConversationFeed} />,
    User: (item) => <UserItem user={item as UserFeed} key={item._id} />,
    Group: (item) => <GroupItem group={item as GroupFeed} key={item._id} />
}