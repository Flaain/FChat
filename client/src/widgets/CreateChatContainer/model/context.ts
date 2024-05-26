import React from "react";
import { CreateChatContainerContextProps } from "./types";

export const CreateChatContainerContext = React.createContext<CreateChatContainerContextProps>({
    type: undefined!,
    handleTypeChange: () => {},
});