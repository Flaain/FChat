import React from "react";
import { ConversationContainerContext } from "../../model/context";

export const useConversationContainer = () => React.useContext(ConversationContainerContext);