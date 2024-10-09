import { OutletHeader } from '@/widgets/OutletHeader';
import { OutletDetails } from '@/widgets/OutletDetails';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { useConversation } from '../../model/context';
import { getConversationDescription } from '../../lib/getConversationDescription';
import { OutletContainer } from '@/shared/ui/OutletContainer';
import { RecipientDetails } from '../RecipientDetails';
import { ConversationDDM } from '../DropdownMenu';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useShallow } from 'zustand/shallow';
import { ConversationBody } from '../Body';
import { Typography } from '@/shared/ui/Typography';
import { SendMessage } from '@/features/SendMessage/ui/ui';

export const Content = () => {
    const { isInitiatorBlocked, isRecipientBlocked, recipient, isRecipientTyping, handleTypingStatus } = useConversation(useShallow((state) => ({
            handleTypingStatus: state.actions.handleTypingStatus,
            isInitiatorBlocked: state.data.conversation.isInitiatorBlocked,
            isRecipientBlocked: state.data.conversation.isRecipientBlocked,
            recipient: state.data.conversation.recipient,
            isRecipientTyping: state.isRecipientTyping
        })));
    const { showDetails, setChatState } = useChat(useShallow((state) => ({
        showDetails: state.showDetails,
        setChatState: state.actions.setChatState
    })));
    
    const description = getConversationDescription({ data: { recipient, isInitiatorBlocked, isRecipientBlocked }, isRecipientTyping });
    
    return (
        <OutletContainer>
            <div className='w-full h-svh flex flex-col gap-5'>
                <OutletHeader
                    onClick={() => setChatState({ showDetails: true })}
                    name={recipient.name}
                    isOfficial={recipient.isOfficial}
                    description={description}
                    dropdownMenu={<ConversationDDM />}
                />
                <ConversationBody />
                <div className='flex flex-col sticky bottom-0 w-full z-[999]'>
                    {isInitiatorBlocked || isRecipientBlocked ? (
                        <div className='w-full h-[70px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out box-border'>
                            <Typography variant='secondary' className='m-auto text-center'>
                                {isRecipientBlocked ? `You blocked ${recipient.name}` : `${recipient.name} has restricted incoming messages`}
                            </Typography>
                        </div>
                    ) : (
                        <SendMessage onChange={handleTypingStatus()} />
                    )}
                </div>
            </div>
            {showDetails && (
                <OutletDetails
                    name={recipient.name}
                    avatarSlot={
                        <Image
                            src={recipient.avatar?.url}
                            skeleton={<AvatarByName name={recipient.name} size='5xl' />}
                            className='object-cover object-center size-28 rounded-full'
                        />
                    }
                    description={description}
                    info={<RecipientDetails recipient={recipient} />}
                    onClose={() => setChatState({ showDetails: false })}
                />
            )}
        </OutletContainer>
    );
};