import React from 'react';
import { ScreenLoader } from '@/shared/ui/ScreenLoader';
import { routerList } from '@/shared/constants';
import { RouteObject } from 'react-router-dom';
import { View } from './model/view';
import { AuthProvider } from './model/store';

export { useAuth } from './model/store';

export const AuthPage: RouteObject = {
    path: routerList.AUTH,
    element: (
        <React.Suspense fallback={<ScreenLoader />}>
            <AuthProvider>
                <View />
            </AuthProvider>
        </React.Suspense>
    )
};