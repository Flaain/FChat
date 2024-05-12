import React from 'react';
import AuthGuard from '@/shared/ui/AuthGuard';
import ScreenLoader from '@/shared/ui/ScreenLoader';
import { routerList } from '@/shared/constants';
import { RouteObject } from 'react-router-dom';
import { View } from './model/view';
import { AuthProvider } from './model/provider';

export const AuthPage: RouteObject = {
    path: routerList.AUTH,
    element: (
        <AuthGuard fallback={<ScreenLoader />}>
            <React.Suspense fallback={<ScreenLoader />}>
                <AuthProvider>
                    <View />
                </AuthProvider>
            </React.Suspense>
        </AuthGuard>
    )
};