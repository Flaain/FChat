import { Conversation } from "@/shared/model/types";

export type ScrollTriggeredFromTypes = "init" | "infiniteScroll" | "send"

export interface ConversationWithMeta {
    conversation: Pick<Conversation, "_id" | "recipient" | "messages">
    nextCursor: string | null
}

export interface ConversationContextProps {
    data: ConversationWithMeta;
    isLoading: boolean;
    value: string;
    setConversation: React.Dispatch<React.SetStateAction<ConversationWithMeta>>;
    setValue: React.Dispatch<React.SetStateAction<string>>
    scrollTriggeredFromRef: React.MutableRefObject<ScrollTriggeredFromTypes>;
}