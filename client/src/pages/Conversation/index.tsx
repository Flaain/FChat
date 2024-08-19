import React from 'react';
import ConversationSkeleton from './ui/Skeletons/ConversationSkeleton';
import OutletError from '@/shared/ui/OutletError';
import { routerList } from '@/shared/constants';
import { RouteObject } from 'react-router-dom';
import { View } from './model/view';
import { ConversationProvider } from './model/provider';
import { Button } from '@/shared/ui/Button';

export const ConversationPage: RouteObject = {
    path: routerList.CONVERSATION,
    element: (
        <React.Suspense fallback={<ConversationSkeleton />}>
            <ConversationProvider>
                <View />
            </ConversationProvider>
        </React.Suspense>
    ),
    errorElement: (
        <OutletError
            title='Failed to load conversation'
            description='Please try to refresh the page'
            callToAction={<Button className='mt-3' onClick={() => window.location.reload()}>Refresh page</Button>}
        />
    )
};