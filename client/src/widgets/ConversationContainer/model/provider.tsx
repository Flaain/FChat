import React from "react";
import { ConversationContainerContext } from "./context";
import { ContainerConversationState, ConversationContainerProviderProps } from "./types";
import { containerReducer } from "./reducer";

const initialState: ContainerConversationState = {
    messageInputValue: "",
    selectedMessageEdit: null,
    sendMessageFormStatus: "send",
};

export const ConversationContainerProvider = ({ children, defaultState }: ConversationContainerProviderProps) => {
    const [state, dispatch] = React.useReducer(containerReducer, { ...initialState, ...defaultState });

    const value = React.useMemo(() => ({ dispatch, state }), [dispatch, state]);

    return (
        <ConversationContainerContext.Provider value={value}>
            {children}
        </ConversationContainerContext.Provider>
    );
};
