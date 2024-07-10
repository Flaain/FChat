import { ConversationFeed, GroupFeed } from '@/shared/model/types';

export const getSortedFeedByLastMessage = (a: GroupFeed | ConversationFeed, b: GroupFeed | ConversationFeed) => {
   return new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime();
};