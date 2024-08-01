import { OTP } from './OTP';
import { ConversationAPI } from './conversationAPI';
import { FeedAPI } from './feedAPI';
import { GroupAPI } from './groupAPI';
import { MessageAPI } from './messageAPI';
import { UserAPI } from './userAPI';

export const api = {
    user: new UserAPI(),
    feed: new FeedAPI(),
    conversation: new ConversationAPI(),
    message: new MessageAPI(),
    group: new GroupAPI(),
    otp: new OTP()
};