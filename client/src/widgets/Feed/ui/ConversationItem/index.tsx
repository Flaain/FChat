import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Typography } from '@/shared/ui/Typography';
import { Image } from '@/shared/ui/Image';
import { ProfileIndicator } from '@/shared/ui/ProfileIndicator';
import { cn } from '@/shared/lib/utils/cn';
import { Verified } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ConversationFeed, PRESENCE, PartOfCompilerUse } from '@/shared/model/types';
import { markdownCompiler } from '@/shared/lib/utils/markdownCompiler';
import { useLayout } from '@/shared/lib/providers/layout/context';

const ConversationItem = ({ conversation }: { conversation: ConversationFeed }) => {
    const { drafts } = useLayout();

    const recipient = conversation.recipient;
    const draft = drafts.get(recipient._id);

    return (
        <li>
            <NavLink
                state={recipient}
                to={`/conversation/${recipient._id}`}
                className={({ isActive }) =>
                    cn(
                        'flex items-center gap-5 p-2 rounded-lg transition-colors duration-200 ease-in-out',
                        isActive
                            ? 'dark:bg-primary-dark-50 bg-primary-gray/10'
                            : 'dark:hover:bg-primary-dark-50/30 hover:bg-primary-gray/5'
                    )
                }
            >
                {recipient.avatar ? (
                    <span className='relative w-[50px] h-[50px]'>
                        <Image
                            src={recipient.avatar.url}
                            skeleton={<AvatarByName name={recipient.name} size='lg' />}
                            className='object-cover object-center min-w-[50px] max-w-[50px] h-[50px] rounded-full'
                        />
                        {recipient.presence === PRESENCE.ONLINE && <ProfileIndicator />}
                    </span>
                ) : (
                    <AvatarByName name={recipient.name} size='lg' isOnline={recipient.presence === PRESENCE.ONLINE} />
                )}
                <div className='flex flex-col items-start w-full overflow-hidden'>
                    <Typography as='h2' weight='medium' className={cn(recipient.isOfficial && 'flex items-center')}>
                        {recipient.name}
                        {recipient.isOfficial && (
                            <Typography className='ml-2'>
                                <Verified className='w-5 h-5' />
                            </Typography>
                        )}
                    </Typography>
                    {!!conversation.participantsTyping?.length ? (
                        <Typography as='p' variant='secondary' className='line-clamp-1'>
                            typing...
                        </Typography>
                    ) : draft?.state === 'send' ? (
                        <Typography as='p' variant='secondary' className='line-clamp-1 break-all'>
                            <Typography as='span' variant='error'>
                                Draft:&nbsp;
                            </Typography>
                            {draft.value}
                        </Typography>
                    ) : (
                        !!conversation.lastMessage && (
                            <div className='flex items-center w-full gap-5'>
                                <Typography className='break-all dark:text-primary-white/30 text-primary-gray line-clamp-1'>
                                    {markdownCompiler(conversation.lastMessage.text, PartOfCompilerUse.FEED)}
                                </Typography>
                                <Typography className='ml-auto' variant='secondary'>
                                    {new Date(conversation.lastMessage.createdAt).toLocaleTimeString(navigator.language, {
                                        hour: 'numeric',
                                        minute: 'numeric'
                                    })}
                                </Typography>
                            </div>
                        )
                    )}
                </div>
            </NavLink>
        </li>
    );
};

export default ConversationItem;