import GuestGuard from '@/shared/ui/GuestGuard';
import ScreenLoader from '@/shared/ui/ScreenLoader';
import React from 'react';
import { routerList } from '@/shared/constants';
import { RouteObject } from 'react-router-dom';
import { View } from './model/view';
import { ConversationProvider } from './model/provider';

export const ConversationPage: RouteObject = {
    path: routerList.CONVERSATION,
    element: (
        <GuestGuard fallback={<ScreenLoader />}>
            <React.Suspense fallback={<ScreenLoader />}>
                <ConversationProvider>
                    <View />
                </ConversationProvider>
            </React.Suspense>
        </GuestGuard>
    )
};