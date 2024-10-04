import React from 'react';
import { useProfile } from '../model/store';
import { sessionAPI, useSession } from '@/entities/session';

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const isAuthorized = useSession((state) => state.isAuthorized);

    React.useEffect(() => {
        if (!isAuthorized) return;

        const errorSubscriber = () => {
            useProfile.setState({ profile: null! });
            useSession.getState().actions.onSignout();
        };

        sessionAPI.subscribeRefreshError(errorSubscriber);

        return () => {
            sessionAPI.unsubscribeRefreshError(errorSubscriber);
        };
    }, [isAuthorized]);

    return children;
};