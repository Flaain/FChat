import { ConversationAPI } from "./conversationAPI";
import { MessageAPI } from "./messageAPI";
import { UserAPI } from "./userAPI";

export const api = { user: new UserAPI(), conversation: new ConversationAPI(), message: new MessageAPI() };