import React from 'react';
import { useProfile } from '../model/store';
import { sessionAPI, useSession } from '@/entities/session';

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const getProfile = useProfile((state) => state.actions.getProfile);
    const isAuthorized = useSession((state) => state.isAuthorized);

    React.useEffect(() => {
        getProfile();
    }, []);

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