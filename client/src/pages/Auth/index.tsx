import React from 'react';
import AuthGuard from '@/shared/ui/AuthGuard';
import ScreenLoader from '@/shared/ui/ScreenLoader';
import { routerList } from '@/shared/constants';
import { RouteObject } from 'react-router-dom';
import { Providers } from './model/providers';
import { View } from './model/view';

export const AuthPage: RouteObject = {
    path: routerList.AUTH,
    element: (
        <AuthGuard fallback={<ScreenLoader />}>
            <React.Suspense fallback={<ScreenLoader />}>
                <Providers>
                    <View />
                </Providers>
            </React.Suspense>
        </AuthGuard>
    )
};