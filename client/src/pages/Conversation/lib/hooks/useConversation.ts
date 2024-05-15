import React from 'react';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { api } from '@/shared/api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ConversationWithMeta } from '@/widgets/ConversationContainer/model/types';

export const useConversation = () => {
    const { id } = useParams();
    const { state: { accessToken, userId } } = useSession();

    const [data, setConversation] = React.useState<ConversationWithMeta>(null!);
    const [isLoading, setIsLoading] = React.useState(false);

    const scrollTriggeredFromRef = React.useRef<"send" | "infiniteScroll">("send");

    const filteredParticipants = React.useMemo(() => {
        return data ? data.conversation.participants.filter((participant) => participant._id !== userId) : [];
    }, [data, userId]);
    const isGroup = filteredParticipants.length >= 2;
    const conversationName = React.useMemo(() => {
        return isGroup ? data.conversation?.name || filteredParticipants.map((participant) => participant.name).join(', ') : filteredParticipants[0]?.name;
    }, [data, filteredParticipants, isGroup]);

    const navigate = useNavigate();

    React.useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                setIsLoading(true);

                const { data } = await api.conversation.getConversation({
                    token: accessToken!,
                    signal: controller.signal,
                    body: { conversationId: id! }
                });
                
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

    return { data, setConversation, isLoading, info: { scrollTriggeredFromRef, filteredParticipants, isGroup, conversationName } };
};