import React from 'react';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { api } from '@/shared/api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ConversationWithMeta } from '@/widgets/ConversationContainer/model/types';
import { ScrollTriggeredFromTypes } from '../../model/types';

export const useConversation = () => {
    const { id } = useParams();
    const { state: { accessToken } } = useSession();

    const [data, setConversation] = React.useState<ConversationWithMeta>(null!);
    const [isLoading, setIsLoading] = React.useState(false);

    const scrollTriggeredFromRef = React.useRef<ScrollTriggeredFromTypes>('init');

    const navigate = useNavigate();

    React.useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                setIsLoading(true);

                const { data } = await api.conversation.get({
                    token: accessToken!,
                    signal: controller.signal,
                    body: { conversationId: id! }
                });

                scrollTriggeredFromRef.current = 'init';

                setConversation(data);
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error(error);
                    toast.error('Cannot get conversation', {
                        position: 'top-center',
                        description: error.message
                    });
                    navigate('/');
                }
            } finally {
                setIsLoading(false);
            }
        })();

        return () => {
            controller.abort();
        };
    }, [accessToken, id, navigate]);

    return {
        data,
        setConversation,
        isLoading,
        scrollTriggeredFromRef,
    };
};