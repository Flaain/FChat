import React from "react";
import { ConversationContainerContextProps } from "./types";

export const ConversationContainerContext = React.createContext<ConversationContainerContextProps>({
    dispatch: () => {},
    state: {
        messageInputValue: "",
        selectedMessageEdit: null,
        sendMessageFormStatus: "send",
    },
});
