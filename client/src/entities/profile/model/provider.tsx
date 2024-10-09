import React from 'react';
import { sessionAPI, useSession } from '@/entities/session';

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const isAuthorized = useSession((state) => state.isAuthorized);

    React.useEffect(() => {
        if (!isAuthorized) return;

        const errorSubscriber = () => useSession.getState().actions.onSignout();

        sessionAPI.subscribeRefreshError(errorSubscriber);

        return () => {
            sessionAPI.unsubscribeRefreshError(errorSubscriber);
        };
    }, [isAuthorized]);

    return children;
};