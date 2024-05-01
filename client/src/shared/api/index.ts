import { ConversationAPI } from "./conversationAPI";
import { UserAPI } from "./userAPI";

export const api = { user: new UserAPI(), conversation: new ConversationAPI() };