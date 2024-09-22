import React from 'react';
import ReactDOM from 'react-dom';
import { Sheet } from './Sheet';
import { Sidebar } from '@/widgets/Sidebar/ui/ui';
import { LayoutSheetSkeleton } from '@/widgets/LayoutSheet/ui/Skeletons/LayoutSheetSkeleton';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LayoutSheetView } from '@/widgets/LayoutSheet';
import { useLayout } from '../lib/providers/layout/context';

export const Layout = () => {
    const { isSheetOpen, onSheet } = useLayout();

    return (
        <main className='flex h-full dark:bg-primary-dark-200 w-full'>
            <Toaster />
            {isSheetOpen &&
                ReactDOM.createPortal(
                    <Sheet withHeader={false} closeHandler={() => onSheet(false)}>
                        <React.Suspense fallback={<LayoutSheetSkeleton />}>
                            <LayoutSheetView />
                        </React.Suspense>
                    </Sheet>,
                    document.querySelector('#modal-root')!
                )}
            <Sidebar />
            <Outlet />
        </main>
    );
};