import ScreenLoader from "@/shared/ui/ScreenLoader";
import { useConversation } from "../lib/hooks/useConversation";
import Container from "./Container";

const Conversation = () => {
    const { conversation, status } = useConversation();

    const statusses = {
        idle: <Container conversation={conversation!} />,
        loading: <ScreenLoader />,
        error: <p>Error</p>,
    }

console.log(conversation)
    return (
       statusses[status as keyof typeof statusses]
    );
};

export default Conversation;