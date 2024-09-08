import { Conversation } from "@/shared/model/types";
import React from "react";

export type ConversationStatuses = "idle" | "loading" | "error";

export interface ConversationWithMeta {
    conversation: Pick<Conversation, "_id" | "recipient" | "messages" | 'createdAt' | 'isInitiatorBlocked' | 'isRecipientBlocked'>
    nextCursor: string | null
}

export interface ConversationContextProps {
    data: ConversationWithMeta;
    status: ConversationStatuses;
    isPreviousMessagesLoading: boolean;
    isRecipientTyping: boolean;
    listRef: React.MutableRefObject<HTMLUListElement | null>;
    handleTypingStatus: () => void;
    handleAnchorClick: () => void;
    getPreviousMessages: () => Promise<void>;
    getConversationDescription: (shouldDisplayTyping?: boolean) => string;
    error: string | null;
    isRefetching: boolean;
    showAcnhor: boolean;
    setShowAnchor: React.Dispatch<React.SetStateAction<boolean>>;
    refetch: () => Promise<void>;
    setConversation: React.Dispatch<React.SetStateAction<ConversationWithMeta>>;
    openDetails: () => void;
    closeDetails: () => void;
    showRecipientDetails: boolean
}