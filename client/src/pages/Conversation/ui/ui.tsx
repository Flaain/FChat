import ScreenLoader from "@/shared/ui/ScreenLoader";
import ConversationContainer from "@/widgets/ConversationContainer/ui/ui";
import { useConversation } from "../lib/hooks/useConversation";

const Conversation = () => {
    const { conversation, setConversation, status, info } = useConversation();

    const statusses = {
        idle: <ConversationContainer conversation={conversation!} setConversation={setConversation} info={info} />,
        loading: <ScreenLoader />,
    };

    return statusses[status as keyof typeof statusses];
};

export default Conversation;