import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { ConversationStatuses } from '../model/types';
import { ConversationSkeleton } from './Skeleton';
import { Content } from '@radix-ui/react-context-menu';
import { useConversationStore } from '../model/store';
import { OutletError } from '@/shared/ui/OutletError';

export const Conversation = () => {
    const { status, error, refetch, isRefetching } = useConversationStore((state) => ({
        status: state.status,
        error: state.error,
        refetch: state.refetch,
        isRefetching: state.isRefetching
    }));

    const components: Record<ConversationStatuses, React.ReactNode> = {
        error: (
            <OutletError
                title='Something went wrong'
                description={error!}
                callToAction={
                    <Button onClick={refetch} className='mt-5'>
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