import SendMessage from "@/features/SendMessage/ui/ui";
import Typography from "@/shared/ui/Typography";
import MessagesList from "@/widgets/MessagesList/ui/ui";
import { ConversationContainerProvider } from "../model/provider";
import { useConversationContext } from "@/pages/Conversation/lib/hooks/useConversationContext";

const ConversationContainer = () => {
    const { conversation, info } = useConversationContext();
    
    return (
        <ConversationContainerProvider>
            <div className='flex flex-col flex-1 gap-5 items-center justify-center dark:bg-primary-dark-200 bg-primary-white'>
                <div className='flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0'>
                    <div className='flex flex-col items-start'>
                        <Typography as='h2' size='lg' weight='medium' variant='primary'>
                            {info.conversationName}
                        </Typography>
                        <Typography as='p' variant='secondary'>
                            last seen yesterday at 10:00
                        </Typography>
                    </div>
                </div>
                {conversation?.conversation.messages.length ? (
                    <MessagesList />
                ) : (
                    <Typography
                        variant='primary'
                        className='my-auto px-5 py-2 rounded-full dark:bg-primary-dark-50 bg-primary-white'
                    >
                        No messages yet
                    </Typography>
                )}
                <SendMessage />
            </div>
        </ConversationContainerProvider>
    );
};

export default ConversationContainer;