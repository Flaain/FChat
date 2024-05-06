import { Conversation } from "@/shared/model/types";

export interface ConversationContainerProps {
    conversation: Conversation;
    setConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
    info: {
        filteredParticipants: Conversation["participants"];
        isGroup: boolean;
        conversationName: string;
    };
}