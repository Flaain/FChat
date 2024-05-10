import ScreenLoader from "@/shared/ui/ScreenLoader";
import ConversationContainer from "@/widgets/ConversationContainer/ui/ui";
import { useConversationContext } from "../lib/hooks/useConversationContext";

const Conversation = () => {
    const { isLoading } = useConversationContext();

    return isLoading ? <ScreenLoader /> : <ConversationContainer />;
};

export default Conversation;