import React from 'react';
import ConversationSkeleton from './ui/Skeletons/ConversationSkeleton';
import { routerList } from '@/shared/constants';
import { RouteObject } from 'react-router-dom';
import { View } from './model/view';
import { ConversationProvider } from './model/provider';

export const ConversationPage: RouteObject = {
    path: routerList.CONVERSATION,
    element: (
        <React.Suspense fallback={<ConversationSkeleton />}>
            <ConversationProvider>
                <View />
            </ConversationProvider>
        </React.Suspense>
    )
};