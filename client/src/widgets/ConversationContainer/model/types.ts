import { ScrollTriggeredFromTypes } from "@/pages/Conversation/model/types";
import { Conversation, IMessage } from "@/shared/model/types";

export interface ConversationWithMeta {
    conversation: Conversation,
    nextCursor: string | null
}

export interface ConversationExtraInfo {
    filteredParticipants: Conversation["participants"];
    scrollTriggeredFromRef: React.MutableRefObject<ScrollTriggeredFromTypes>;
}

export interface ConversationContextProps {
    conversation: ConversationWithMeta;
    isLoading: boolean;
    setConversation: React.Dispatch<React.SetStateAction<ConversationWithMeta>>;
    info: ConversationExtraInfo;
}

export interface ConversationContainerProviderProps {
    children: React.ReactNode;
    defaultState?: Partial<ContainerConversationState>;
}

export interface ConversationContainerContextProps {
    state: ContainerConversationState;
    dispatch: React.Dispatch<ContainerConversationAction>;
}

export enum ContainerConversationTypes {
    SET_CLOSE = "SET_CLOSE",
    SET_VALUE = "SET_VALUE",
    SET_STATE = "SET_STATE",
    SET_SELECTED_MESSAGE = "SET_SELECTED_MESSAGE",
}

export type MessageFormState = "send" | "edit";

export interface ContainerConversationState {
    value: string;
    selectedMessage: IMessage | null;
    formState: MessageFormState;
}

export type ContainerConversationAction =
    | { type: ContainerConversationTypes.SET_VALUE; payload: { value: string } }
    | { type: ContainerConversationTypes.SET_STATE; payload: { status: MessageFormState } }
    | { type: ContainerConversationTypes.SET_CLOSE; payload: { value: string, selectedMessage: null, formState: "send" } }
    | { type: ContainerConversationTypes.SET_SELECTED_MESSAGE; payload: { message: IMessage; formState: MessageFormState } }