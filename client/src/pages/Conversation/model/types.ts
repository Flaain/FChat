import { Conversation } from "@/shared/model/types";

export type ScrollTriggeredFromTypes = "init" | "infiniteScroll" | "send"

export interface ConversationWithMeta {
    conversation: Pick<Conversation, "_id" | "recipient" | "messages">
    nextCursor: string | null
}

export interface ConversationContextProps {
    data: ConversationWithMeta;
    isLoading: boolean;
    setConversation: React.Dispatch<React.SetStateAction<ConversationWithMeta>>;
    scrollTriggeredFromRef: React.MutableRefObject<ScrollTriggeredFromTypes>;
}