import React from "react";
import { ConversationContextProps } from "./types";

export const ConversationContext = React.createContext<ConversationContextProps>({
    data: undefined!,
    value: '',
    isLoading: true,
    setConversation: () => {},
    setValue: () => {},
    scrollTriggeredFromRef: { current: 'init' }
});