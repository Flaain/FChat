import React from 'react';
import ReactDOM from 'react-dom';
import { Sheet } from './Sheet';
import Sidebar from '@/widgets/Sidebar/ui/ui';
import LayoutSheetSkeleton from '@/widgets/LayoutSheet/ui/Skeletons/LayoutSheetSkeleton';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LayoutSheetView } from '@/widgets/LayoutSheet/model/view';
import { useLayout } from '../model/store';

export const Layout = () => {
    const { isSheetOpen, onCloseSheet } = useLayout();

    return (
        <main className='flex h-full dark:bg-primary-dark-200 w-full'>
            <Toaster />
            {isSheetOpen &&
                ReactDOM.createPortal(
                    <Sheet withHeader={false} closeHandler={onCloseSheet}>
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