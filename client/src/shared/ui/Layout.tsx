import React from 'react';
import ReactDOM from 'react-dom';
import Sheet from './Sheet';
import Sidebar from '@/widgets/Sidebar/ui/ui';
import LayoutSheetSkeleton from '@/widgets/LayoutSheet/ui/Skeletons/LayoutSheetSkeleton';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useLayoutContext } from '../lib/hooks/useLayoutContext';
import { LayoutSheetView } from '@/widgets/LayoutSheet/model/view';

const Layout = () => {
    const { openSheet, setOpenSheet } = useLayoutContext();

    return (
        <main className='flex h-full dark:bg-primary-dark-200 w-full'>
            <Toaster />
            {openSheet &&
                ReactDOM.createPortal(
                    <Sheet withHeader={false} closeHandler={() => setOpenSheet(false)}>
                        <React.Suspense fallback={<LayoutSheetSkeleton />}>
                            <LayoutSheetView setSheetOpen={setOpenSheet} />
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