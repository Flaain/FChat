import { Avatar, Recipient } from "@/shared/model/types";

export interface REMOVE_THIS_LATER {
    _id: string;
    name?: string;
    avatar?: Avatar;
    user: Recipient;
}

export type Message = {
    _id: string;
    hasBeenRead: boolean;
    hasBeenEdited: boolean;
    text: string;
    replyTo?: Pick<Message, '_id' | 'text'> & ({ sender: Recipient; refPath: "User" } | { sender: REMOVE_THIS_LATER; refPath: "Participant" }) | null;
    createdAt: string;
    updatedAt: string;
    sendingInProgress?: boolean;
} & ({ sender: Recipient; refPath: "User" } | { sender: REMOVE_THIS_LATER; refPath: "Participant" });

export interface UseMessageProps {
    message: Message;
}

export interface MessageProps extends React.HTMLAttributes<HTMLLIElement> {
    message: Message;
    isMessageFromMe: boolean;
    isFirst: boolean;
    isLast: boolean;
}

export interface ContextMenuProps {
    message: Message;
    isMessageFromMe: boolean;
    onClose: () => void;
}

export interface DeleteMessageRes {
    isLastMessage: boolean;
    lastMessage: Message;
    lastMessageSentAt: string;
}

export interface DefaultParamsAPI {
    query: string;
    body: string;
}

export interface MessageStore {
    isContextActionsDisabled: boolean;
}