import React from 'react';
import { api } from '@/shared/api';
import { GetSessionsReturn } from '@/shared/model/types';
import { toast } from 'sonner';
import { useModal } from '@/shared/lib/hooks/useModal';

export const useActiveSessions = () => {
    const { setIsAsyncActionLoading } = useModal();

    const [sessions, setSessions] = React.useState<GetSessionsReturn | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isTerminating, setIsTerminating] = React.useState(false);

    const handleTerimanteSessions = async () => {
        try {
            setIsTerminating(true);
            setIsAsyncActionLoading(true);

            const { data: { deletedCount } } = await api.session.terminateAllSessions();

            setSessions((prevState) => ({ ...prevState!, sessions: [] }));

            toast.success(`${deletedCount} ${deletedCount > 1 ? 'sessions' : 'session'} was terminated`, { position: 'top-center' });
        } catch (error) {
            console.error(error);
            toast.error('Failed to terminate sessions', { position: 'top-center' });
        } finally {
            setIsTerminating(false);
            setIsAsyncActionLoading(false);
        }
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
                const { data } = await api.session.getSessions();

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