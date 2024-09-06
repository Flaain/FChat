export const getSortedFeedByLastMessage = (a: { lastActionAt: string }, b: { lastActionAt: string }) => {
   return new Date(b.lastActionAt).getTime() - new Date(a.lastActionAt).getTime();
};