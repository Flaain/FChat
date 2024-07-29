export const getSortedFeedByLastMessage = (a: { lastMessageSentAt: string }, b: { lastMessageSentAt: string }) => {
   return new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime();
};