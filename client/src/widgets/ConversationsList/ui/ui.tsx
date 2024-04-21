import { useProfile } from "@/shared/lib/hooks/useProfile";
import SideConversationSkeleton from "./Skeletons/SideConversationSkeleton";

const ConversationsList = () => {
    const { profile: { conversations } } = useProfile()
    
    if (!conversations.length) return <SideConversationSkeleton />

    return null
};

export default ConversationsList;
