import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../model/router';
import { sessionAPI, useSession } from '@/entities/session';
import { useProfile } from '@/entities/profile';

const App = () => {
    const getProfile = useProfile((state) => state.getProfile);
    const onLogout = useSession((state) => state.onLogout);

    React.useEffect(() => {
        getProfile();

        sessionAPI.subscribeRefreshError(onLogout);

        return () => {
            sessionAPI.unsubscribeRefreshError(onLogout);
        };
    }, []);

    return <RouterProvider router={router} />;
};

export default App;