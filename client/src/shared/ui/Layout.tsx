import React from 'react';
import ReactDOM from 'react-dom';
import { Sheet } from './Sheet';
import { LayoutSheetSkeleton } from '@/widgets/LayoutSheet/ui/Skeletons/LayoutSheetSkeleton';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LayoutSheetView } from '@/widgets/LayoutSheet';
import { useLayout } from '../model/store';
import { Sidebar, SidebarProvider } from '@/widgets/Sidebar';

export const Layout = () => {
    const isSheetOpen = useLayout((state) => state.isSheetOpen);

    return (
        <main className='flex h-full dark:bg-primary-dark-200 w-full relative'>
            <Toaster />
            {isSheetOpen &&
                ReactDOM.createPortal(
                    <Sheet withHeader={false} closeHandler={() => useLayout.setState({ isSheetOpen: false })}>
                        <React.Suspense fallback={<LayoutSheetSkeleton />}>
                            <LayoutSheetView />
                        </React.Suspense>
                    </Sheet>,
                    document.querySelector('#modal-root')!
                )}
            <SidebarProvider>
                <Sidebar />
            </SidebarProvider>
            <Outlet />
        </main>
    );
};
