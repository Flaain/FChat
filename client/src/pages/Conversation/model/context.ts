import { ConversationContextProps } from "@/widgets/ConversationContainer/model/types";
import React from "react";

export const ConversationContext = React.createContext<ConversationContextProps>({
    data: undefined!,
    isLoading: true,
    setConversation: () => {},
    scrollTriggeredFromRef: { current: 'init' }
});