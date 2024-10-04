import React from 'react';
import { Guard } from '../model/Guard';
import { ScreenLoader } from '@/shared/ui/ScreenLoader';
import { Layout } from '@/shared/ui/Layout';
import { LayoutProvider } from './provider';

export const baseLayout = (
    <Guard type='guest' fallback={<ScreenLoader />}>
        <React.Suspense fallback={<ScreenLoader />}>
            <LayoutProvider>
                <Layout />
            </LayoutProvider>
        </React.Suspense>
    </Guard>
);