import { useProfile } from "@/shared/lib/hooks/useProfile";
import SideConversationSkeleton from "./Skeletons/SideConversationSkeleton";
import { Conversation } from "@/shared/model/types";
import { ConversationListProps } from "../model/types";
import { useSession } from "@/entities/session/lib/hooks/useSession";

const ConversationsList = ({ searchValue }: ConversationListProps) => {
    const {
        profile: { conversations },
    } = useProfile();
    const {
        state: { userId },
    } = useSession();

    if (!conversations.length) return <SideConversationSkeleton />;

    const filterConversationsByInput = (conversation: Conversation) => {
        const name = conversation.name?.toLowerCase().includes(searchValue.toLowerCase());
        const participant = conversation.participants.some((participant) =>
            participant.name?.toLowerCase().includes(searchValue.toLowerCase())
        );

        return name || participant;
    };

    const filteredConversations = conversations.filter(filterConversationsByInput);

    return filteredConversations.length ? (
        filteredConversations.map((conversation) => (
            <div key={conversation._id} className='w-full'>
                to&nbsp;
                {conversation.name ??
                    conversation.participants
                        .filter((participant) => participant._id !== userId)
                        .map((participant) => participant.name)
                        .join(",")}
            </div>
        ))
    ) : (
        <div className='w-full'>No conversations finded</div>
    );
};

export default ConversationsList;