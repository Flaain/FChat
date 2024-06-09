import React from "react";
import { ConversationContainerContextProps } from "./types";

export const ConversationContainerContext = React.createContext<ConversationContainerContextProps>({
    dispatch: () => {},
    state: {
        value: "",
        selectedMessage: null,
        formState: "send",
    },
});
