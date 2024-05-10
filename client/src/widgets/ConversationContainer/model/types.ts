import { Conversation, IMessage } from "@/shared/model/types";

export interface ConversationExtraInfo {
    filteredParticipants: Conversation["participants"];
    isGroup: boolean;
    conversationName: string;
}

export interface ConversationContextProps {
    conversation: Conversation;
    isLoading: boolean;
    setConversation: React.Dispatch<React.SetStateAction<Conversation>>;
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
    SET_CLOSE_EDIT_FORM = "SET_CLOSE_EDIT_FORM",
    SET_MESSAGE_INPUT_VALUE = "SET_MESSAGE_INPUT_VALUE",
    SET_SELECTED_MESSAGE_EDIT = "SET_SELECTED_MESSAGE_EDIT",
    SET_SEND_MESSAGE_FORM_STATUS = "SET_SEND_MESSAGE_FORM_STATUS",
}

export type MessageFormStatus = "send" | "edit";

export interface ContainerConversationState {
    messageInputValue: string;
    selectedMessageEdit: IMessage | null;
    sendMessageFormStatus: MessageFormStatus;
}

export type ContainerConversationAction =
    | { type: ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE; payload: { value: string } }
    | {
          type: ContainerConversationTypes.SET_CLOSE_EDIT_FORM;
          payload: { value: string; sendMessageFormStatus: MessageFormStatus; selectedMessageEdit: IMessage | null };
      }
    | {
          type: ContainerConversationTypes.SET_SELECTED_MESSAGE_EDIT;
          payload: { message: IMessage; sendMessageFormStatus: MessageFormStatus };
      }
    | { type: ContainerConversationTypes.SET_SEND_MESSAGE_FORM_STATUS; payload: { status: MessageFormStatus } };