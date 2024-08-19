import { Conversation } from "@/shared/model/types";

export type ConversationStatuses = "idle" | "loading" | "error";

export interface ConversationWithMeta {
    conversation: Pick<Conversation, "_id" | "recipient" | "messages" | 'createdAt'>
    nextCursor: string | null
}

export interface ConversationContextProps {
    data: ConversationWithMeta;
    status: ConversationStatuses;
    isPreviousMessagesLoading: boolean;
    getPreviousMessages: () => Promise<void>;
    error: string | null;
    isRefetching: boolean;
    refetch: () => Promise<void>;
    setConversation: React.Dispatch<React.SetStateAction<ConversationWithMeta>>;
    setShowRecipientDetails: React.Dispatch<React.SetStateAction<boolean>>;
    showRecipientDetails: boolean
}