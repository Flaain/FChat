import React from 'react';
import { toast } from 'sonner';
import { GetSessionsReturn } from '@/entities/session/model/types';
import { useModal } from '@/shared/lib/providers/modal';
import { sessionAPI } from '@/entities/session';

export const useActiveSessions = () => {
    const [sessions, setSessions] = React.useState<GetSessionsReturn | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isTerminating, setIsTerminating] = React.useState(false);

    const onAsyncActionModal = useModal((state) => state.onAsyncActionModal);

    const handleTerimanteSessions = async () => {
        setIsTerminating(true);

        onAsyncActionModal(sessionAPI.terminateAllSessions, {
            onResolve: ({ data: { deletedCount } }) => {
                setSessions((prevState) => ({ ...prevState!, sessions: [] }));
                toast.success(`${deletedCount} ${deletedCount > 1 ? 'sessions' : 'session'} was terminated`, {
                    position: 'top-center'
                });
            },
            onReject: (error) => {
                console.error(error);
                toast.error('Failed to terminate sessions', { position: 'top-center' });
            }
        });

        setIsTerminating(false);
    };

    const handleDropSession = React.useCallback(async (sessionId: string) => {
        setSessions((prevState) => ({
            ...prevState!,
            sessions: prevState!.sessions.filter((session) => session._id !== sessionId)
        }));
    }, []);

    React.useEffect(() => {
        (async () => {
            try {
                const { data } = await sessionAPI.getSessions();

                setSessions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return { sessions, isLoading, isTerminating, handleDropSession, handleTerimanteSessions };
};