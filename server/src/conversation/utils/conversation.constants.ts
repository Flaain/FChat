export const CONVERSATION_POPULATE = [
    { path: 'participants', model: 'User', select: 'name email' },
    { path: 'messages', model: 'Message', populate: { path: 'sender', model: 'User', select: 'name email' } },
    { path: 'creator', model: 'User', select: 'name email' },
];