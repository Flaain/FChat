import React from 'react';
import { Guard } from '../model/Guard';
import { ScreenLoader } from '@/shared/ui/ScreenLoader';
import { Layout } from '@/shared/ui/Layout';
import { SocketProvider } from '@/shared/lib/providers/socket/provider';
import { ModalProvider } from '@/shared/lib/providers/modal';
import { LayoutProvider } from '@/shared/lib/providers/layout/provider';

export const baseLayout = (
    <Guard type='guest' fallback={<ScreenLoader />}>
        <React.Suspense fallback={<ScreenLoader />}>
            <SocketProvider>
                <ModalProvider>
                    <LayoutProvider>
                        <Layout />
                    </LayoutProvider>
                </ModalProvider>
            </SocketProvider>
        </React.Suspense>
    </Guard>
);