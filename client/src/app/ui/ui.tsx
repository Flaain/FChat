import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../model/router';
import { api } from '@/shared/api';
import { useTheme } from '@/entities/theme/model/store';
import { useProfile } from '../providers/profile/store';
import { useSession } from '@/entities/session/model/store';

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

        api.user.subscribeRefreshError(onRefreshError);

        return () => {
            api.user.unsubscribeRefreshError(onRefreshError);
        };
    }, []);

    return <RouterProvider router={router} />;
};

export default App;