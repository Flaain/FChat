import { ContainerConversationAction, ContainerConversationState, ContainerConversationTypes } from "./types";

export const containerReducer = (state: ContainerConversationState, { type, payload }: ContainerConversationAction) => {
    switch (type) {
        case ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE:
            return { ...state, messageInputValue: payload.value };
        case ContainerConversationTypes.SET_SELECTED_MESSAGE_EDIT:
            return {
                ...state,
                selectedMessageEdit: payload.message,
                messageInputValue: payload.message.text,
                sendMessageFormStatus: payload.sendMessageFormStatus,
            };
        case ContainerConversationTypes.SET_CLOSE_EDIT_FORM:
            return {
                ...state,
                messageInputValue: payload.value,
                sendMessageFormStatus: payload.sendMessageFormStatus,
                selectedMessageEdit: payload.selectedMessageEdit,
            };
        case ContainerConversationTypes.SET_SEND_MESSAGE_FORM_STATUS:
            return { ...state, sendMessageFormStatus: payload.status };
        default:
            return state;
    }
};