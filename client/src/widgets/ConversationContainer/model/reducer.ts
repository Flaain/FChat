import { ContainerConversationAction, ContainerConversationState, ContainerConversationTypes } from './types';

export const containerReducer = (state: ContainerConversationState, { type, payload }: ContainerConversationAction) => {
    switch (type) {
        case ContainerConversationTypes.SET_VALUE:
            return { ...state, value: payload.value };
        case ContainerConversationTypes.SET_SELECTED_MESSAGE:
            return {
                ...state,
                value: payload.message.text,
                selectedMessage: payload.message,
                formState: payload.formState
            };
        case ContainerConversationTypes.SET_CLOSE:
            return {
                ...state,
                value: payload.value,
                formState: payload.formState,
                selectedMessage: payload.selectedMessage
            };
        case ContainerConversationTypes.SET_STATE:
            return { ...state, formState: payload.status };
        default:
            return state;
    }
};