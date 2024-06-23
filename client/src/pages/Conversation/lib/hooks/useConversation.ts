import React from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { ConversationWithMeta, ScrollTriggeredFromTypes } from '../../model/types';

export const useConversation = () => {
    const { id } = useParams();
    const { state: { accessToken } } = useSession();

    const [data, setConversation] = React.useState<ConversationWithMeta>(null!);
    const [isLoading, setIsLoading] = React.useState(false);

    const scrollTriggeredFromRef = React.useRef<ScrollTriggeredFromTypes>('init');

    const navigate = useNavigate();

    React.useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);

                const { data } = await api.conversation.get({
                    token: accessToken!,
                    body: { recipientId: id! }
                });

                scrollTriggeredFromRef.current = 'init';

                setConversation(data);
            } catch (error) {
                console.error(error);
                error instanceof Error && toast.error('Cannot get conversation', {
                    position: 'top-center',
                    description: error.message
                });
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        })();
    }, [id]);

    return {
        data,
        isLoading,
        scrollTriggeredFromRef,
        setConversation,
    };
};