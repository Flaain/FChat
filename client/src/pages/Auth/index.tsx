import React from 'react';
import { ScreenLoader } from '@/shared/ui/ScreenLoader';
import { routerList } from '@/shared/constants';
import { RouteObject } from 'react-router-dom';
import { View } from './model/view';
import { AuthProvider } from './model/provider';
import { OtpProvider } from '@/shared/lib/providers/otp/provider';

export { useAuth } from './model/context';

export const AuthPage: RouteObject = {
    path: routerList.AUTH,
    element: (
        <React.Suspense fallback={<ScreenLoader />}>
            <AuthProvider>
                <OtpProvider>
                    <View />
                </OtpProvider>
            </AuthProvider>
        </React.Suspense>
    )
};