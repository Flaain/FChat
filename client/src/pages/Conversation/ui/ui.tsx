import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { ConversationStatuses } from '../model/types';
import { ConversationSkeleton } from './Skeleton';
import { OutletError } from '@/shared/ui/OutletError';
import { Content } from './Content';
import { useConversation } from '../model/context';
import { useParams } from 'react-router-dom';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useShallow } from 'zustand/shallow';

export const Conversation = () => {
    const { id } = useParams();
    const { status, error, isRefetching, getConversation } = useConversation(useShallow((state) => ({
        status: state.status,
        error: state.error,
        isRefetching: state.isRefetching,
        getConversation: state.actions.getConversation
    })));
    const setChatState = useChat((state) => state.actions.setChatState);

    const components: Record<ConversationStatuses, React.ReactNode> = {
        error: (
            <OutletError
                title='Something went wrong'
                description={error!}
                callToAction={
                    <Button onClick={() => getConversation('refetch', id!, setChatState)} className='mt-5'>
                        {isRefetching ? <Loader2 className='w-6 h-6 animate-spin' /> : 'try again'}
                    </Button>
                }
            />
        ),
        loading: <ConversationSkeleton />,
        idle: <Content />
    };

    return components[status];
};