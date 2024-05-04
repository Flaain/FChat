import AvatarByName from "@/shared/ui/AvatarByName";
import Typography from "@/shared/ui/Typography";
import SideConversationSkeleton from "./Skeletons/SideConversationSkeleton";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { Conversation } from "@/shared/model/types";
import { ConversationListProps } from "../model/types";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { MessagesSquare } from "lucide-react";
import { Link } from "react-router-dom";

const ConversationsList = ({ searchValue }: ConversationListProps) => {
    const { profile: { conversations } } = useProfile();
    const { state: { userId } } = useSession();

    if (!conversations.length) return <SideConversationSkeleton />;

    const filterConversationsByInput = (conversation: Conversation) => {
        const name = conversation.name?.toLowerCase().includes(searchValue.toLowerCase());
        const participant = conversation.participants.some((participant) => participant.name?.toLowerCase().includes(searchValue.toLowerCase()));

        return name || participant;
    };

    const filteredConversations = conversations.filter(filterConversationsByInput);

    return filteredConversations.length ? (
        <ul className='flex flex-col gap-5'>
            {filteredConversations.map((conversation) => {
                const lastMessage = conversation.messages[0];
                const filteredParticipants = conversation.participants.filter((participant) => participant._id !== userId);
                const isGroup = filteredParticipants.length >= 2;
                const lastMessageDescription = `${lastMessage.sender._id === userId ? "You: " : isGroup ? lastMessage.sender.name : ""}`;

                return (
                    <li key={conversation._id}>
                        <Link
                            to={`conversation/${conversation._id}`}
                            className='flex items-center gap-5 p-2 rounded-lg dark:hover:bg-primary-dark-50 transition-colors duration-200 ease-in-out'
                        >
                            {isGroup ? (
                                <span className='min-w-[50px] min-h-[50px] flex justify-center items-center rounded-full dark:bg-primary-white bg-primary-dark-100 text-2xl font-bold dark:text-primary-dark-200 text-primary-white'>
                                    <MessagesSquare />
                                </span>
                            ) : (
                                <AvatarByName name={filteredParticipants[0].name} />
                            )}
                            <div className='flex flex-col items-start w-full'>
                                <Typography as='h2'>
                                    {conversation.name ??
                                        filteredParticipants.map((participant) => participant.name).join(", ")}
                                </Typography>
                                {!!lastMessage && (
                                    <div className='flex items-center w-full'>
                                        <Typography
                                            as='p'
                                            variant='secondary'
                                            className='max-w-[200px] w-full truncate'
                                        >
                                            {lastMessageDescription}{lastMessage.text}
                                        </Typography>
                                        <Typography className='ml-auto' variant='secondary'>
                                            {new Date(lastMessage.createdAt).toLocaleTimeString(navigator.language, {
                                                hour: "numeric",
                                                minute: "numeric",
                                            })}
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    ) : (
        <Typography as='p' variant='secondary'>
            No conversations finded
        </Typography>
    );
};

export default ConversationsList;