import AvatarByName from '@/shared/ui/AvatarByName';
import Typography from '@/shared/ui/Typography';
import SideConversationSkeleton from './Skeletons/SideConversationSkeleton';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { Conversation } from '@/shared/model/types';
import { ConversationListProps } from '../model/types';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib/utils/cn';

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
        <ul className='flex flex-col gap-5 px-3 overflow-auto'>
            {filteredConversations.map((conversation) => {
                const lastMessage = conversation.messages[0];
                const filteredParticipants = conversation.participants.filter((participant) => participant._id !== userId);
                const isGroup = filteredParticipants.length >= 2;
                const lastMessageDescription = lastMessage && `${lastMessage.sender._id === userId ? 'You: ' : isGroup ? `${lastMessage.sender.name}: ` : ''}`;

                return (
                    <li key={conversation._id}>
                        <NavLink
                            to={`conversation/${conversation._id}`}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-5 p-2 rounded-lg dark:hover:bg-primary-dark-50 transition-colors duration-200 ease-in-out',
                                    isActive && 'bg-primary-dark-50'
                                )
                            }
                        >
                            <AvatarByName name={isGroup ? undefined : filteredParticipants[0].name} size='lg' />
                            <div className='flex flex-col items-start w-full'>
                                <Typography as='h2'>
                                    {conversation.name || filteredParticipants.map((participant) => participant.name).join(', ')}
                                </Typography>
                                {!!lastMessage && (
                                    <div className='flex items-center w-full gap-5'>
                                        <Typography as='p' variant='secondary' className='line-clamp-1'>
                                            {lastMessageDescription}
                                            {lastMessage.text}
                                        </Typography>
                                        <Typography className='ml-auto' variant='secondary'>
                                            {new Date(lastMessage.createdAt).toLocaleTimeString(navigator.language, {
                                                hour: 'numeric',
                                                minute: 'numeric'
                                            })}
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </NavLink>
                    </li>
                );
            })}
        </ul>
    ) : (
        <Typography as='p' variant='secondary' className='self-center'>
            No conversations finded
        </Typography>
    );
};

export default ConversationsList;
