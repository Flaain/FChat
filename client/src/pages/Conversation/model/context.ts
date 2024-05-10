import { ConversationContextProps } from "@/widgets/ConversationContainer/model/types";
import React from "react";

export const ConversationContext = React.createContext<ConversationContextProps>({
    conversation: undefined!,
    info: undefined!,
    isLoading: true,
    setConversation: () => {},
});