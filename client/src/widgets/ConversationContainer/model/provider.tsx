import React from "react";
import { ConversationContainerContext } from "./context";
import { ContainerConversationState, ConversationContainerProviderProps } from "./types";
import { containerReducer } from "./reducer";
import { useConversationContext } from "@/pages/Conversation/lib/hooks/useConversationContext";

const initialState: ContainerConversationState = {
    messageInputValue: "",
    selectedMessageEdit: null,
    sendMessageFormStatus: "send",
};

export const ConversationContainerProvider = ({ children, defaultState }: ConversationContainerProviderProps) => {
    const { conversation, info, setConversation } = useConversationContext();
    const [state, dispatch] = React.useReducer(containerReducer, { ...initialState, ...defaultState });

    const value = React.useMemo(() => ({ conversation, dispatch, info, setConversation, state }), [conversation, dispatch, info, setConversation, state]);

    return (
        <ConversationContainerContext.Provider value={value}>
            {children}
        </ConversationContainerContext.Provider>
    );
};
