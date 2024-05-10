import React from "react";
import { ConversationContext } from "../../model/context";

export const useConversationContext = () => React.useContext(ConversationContext);