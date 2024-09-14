import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../model/router';
import { sessionApi, useSession } from '@/entities/session';
import { useProfile } from '@/entities/profile';
import { useTheme } from '@/entities/theme';

const App = () => {
    const { theme } = useTheme();
    const { getProfile, resetProfile } = useProfile();
    const { onLogout } = useSession();

    React.useLayoutEffect(() => {
        const root = window.document.documentElement;

        root.classList.add(theme);

        return () => {
            root.classList.remove('light', 'dark');
        };
    }, [theme]);

    React.useEffect(() => {
        getProfile();

        const onRefreshError = () => {
            onLogout();
            resetProfile();
        };

        sessionApi.subscribeRefreshError(onRefreshError);

        return () => {
            sessionApi.unsubscribeRefreshError(onRefreshError);
        };
    }, []);

    return <RouterProvider router={router} />;
};

export default App;