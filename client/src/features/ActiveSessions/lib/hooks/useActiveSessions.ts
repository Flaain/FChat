import React from 'react';
import { api } from '@/shared/api';
import { GetSessionsReturn } from '@/shared/model/types';

export const useActiveSessions = () => {
    const [sessions, setSessions] = React.useState<GetSessionsReturn | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const handleTerimanteSessions = async () => {};

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

    return { sessions, isLoading, handleDropSession, handleTerimanteSessions };
};
