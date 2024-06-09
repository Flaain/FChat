import { ConversationAPI } from './conversationAPI';
import { GroupAPI } from './groupAPI';
import { MessageAPI } from './messageAPI';
import { UserAPI } from './userAPI';

export const api = {
    user: new UserAPI(),
    conversation: new ConversationAPI(),
    message: new MessageAPI(),
    group: new GroupAPI()
};