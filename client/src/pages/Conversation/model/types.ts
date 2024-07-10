import { Conversation } from "@/shared/model/types";

export type ScrollTriggeredFromTypes = "init" | "infiniteScroll" | "send"
export type ConversationStatuses = "idle" | "loading" | "error";

export interface ConversationWithMeta {
    conversation: Pick<Conversation, "_id" | "recipient" | "messages" | 'createdAt'>
    nextCursor: string | null
}

export interface ConversationContextProps {
    data: ConversationWithMeta;
    status: ConversationStatuses;
    scrollTriggeredFromRef: React.MutableRefObject<ScrollTriggeredFromTypes>;
    error: string | null;
    isRefetching: boolean;
    refetch: () => Promise<void>;
    setConversation: React.Dispatch<React.SetStateAction<ConversationWithMeta>>;
}