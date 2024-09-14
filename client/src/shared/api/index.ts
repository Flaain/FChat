import { ConversationAPI } from './conversationAPI';
import { FeedAPI } from './feedAPI';
import { GroupAPI } from './groupAPI';
import { SessionAPI } from './sessionAPI';
import { UserAPI } from './userAPI';

export const api = {
    user: new UserAPI(),
    feed: new FeedAPI(),
    session: new SessionAPI(),
    conversation: new ConversationAPI(),
    group: new GroupAPI(),
};