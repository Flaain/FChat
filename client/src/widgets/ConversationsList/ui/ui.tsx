import AvatarByName from "@/shared/ui/AvatarByName";
import Typography from "@/shared/ui/Typography";
import SideConversationSkeleton from "./Skeletons/SideConversationSkeleton";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { Conversation } from "@/shared/model/types";
import { ConversationListProps } from "../model/types";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";

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
        <ul className="flex flex-col gap-5">
            {filteredConversations.map((conversation) => {
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                const filteredParticipants = conversation.participants.filter((participant) => participant._id !== userId);
                const isGroup = filteredParticipants.length >= 2;

                return (
                    <li key={conversation._id}>
                        <Link to={`conversation/${conversation._id}`} className='flex items-center gap-5 p-2 rounded-lg dark:hover:bg-primary-dark-50'>
                            {isGroup ? <UserRound /> : <AvatarByName name={filteredParticipants[0].name} />}
                            <div className='flex flex-col items-center gap-2'>
                                <Typography>
                                    {conversation.name ??
                                        filteredParticipants.map((participant) => participant.name).join(", ")}
                                </Typography>
                                {!!conversation.messages.length && (
                                    <Typography>
                                        {lastMessage.sender._id === userId ? "You" : lastMessage.sender.name}:
                                        {lastMessage.text}
                                    </Typography>
                                )}
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    ) : (
        <Typography as="p" variant="secondary">No conversations finded</Typography>
    );
};

export default ConversationsList;
