import React from 'react';
import ReactDOM from 'react-dom';
import Sheet from './Sheet';
import Sidebar from '@/widgets/Sidebar/ui/ui';
import LayoutSheetSkeleton from '@/widgets/LayoutSheet/ui/Skeletons/LayoutSheetSkeleton';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LayoutSheetView } from '@/widgets/LayoutSheet/model/view';
import { useDomEvents, useLayout } from '../model/store';

const Layout = () => {
    const { listeners } = useDomEvents();
    const { isSheetOpen, onCloseSheet } = useLayout();

    React.useEffect(() => {
        if (!listeners.size) return;

        const entries = [...new Map([...listeners]).entries()];

        const mappedListeners = entries.map(([type, listeners]) => {
            const lastListener = [...listeners.values()]?.pop();

            if (!lastListener) return { type, listener: () => {} };

            document.addEventListener(type, lastListener);

            return { type, listener: lastListener };
        });

        return () => {
            mappedListeners.forEach(({ type, listener }) => {
                document.removeEventListener(type, listener);
            });
        };
    }, [listeners]);

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

export default Layout;