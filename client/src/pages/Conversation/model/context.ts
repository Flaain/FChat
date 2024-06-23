import React from "react";
import { ConversationContextProps } from "./types";

export const ConversationContext = React.createContext<ConversationContextProps>({
    data: undefined!,
    isLoading: true,
    setConversation: () => {},
    scrollTriggeredFromRef: { current: 'init' },
});