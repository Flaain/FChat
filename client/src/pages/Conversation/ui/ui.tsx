import ScreenLoader from "@/shared/ui/ScreenLoader";
import Container from "./Container";
import { useConversation } from "../lib/hooks/useConversation";

const Conversation = () => {
    const { conversation, status } = useConversation();

    const statusses = {
        idle: <Container conversation={conversation!} />,
        loading: <ScreenLoader />,
    };

    return statusses[status as keyof typeof statusses];
};

export default Conversation;