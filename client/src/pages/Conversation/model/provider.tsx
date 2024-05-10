import React from "react";
import { useConversation } from "../lib/hooks/useConversation";
import { ConversationContext } from "./context";

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
    const { conversation, setConversation, isLoading, info } = useConversation();

    const value = React.useMemo(() => ({ conversation, setConversation, info, isLoading }), [conversation, info, setConversation, isLoading]);

    return (
        <ConversationContext.Provider value={value}>
            {children}
        </ConversationContext.Provider>
    );
};
