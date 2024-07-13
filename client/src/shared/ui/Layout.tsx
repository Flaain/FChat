import ReactDOM from 'react-dom';
import Sheet from './Sheet';
import Sidebar from '@/widgets/Sidebar/ui/ui';
import LayoutSheet from '@/widgets/LayoutSheet/ui/ui';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useLayoutContext } from '../lib/hooks/useLayoutContext';

const Layout = () => {
    const { openSheet, setOpenSheet } = useLayoutContext();

    return (
        <main className='flex h-full dark:bg-primary-dark-200 w-full'>
            <Toaster />
            {openSheet &&
                ReactDOM.createPortal(
                    <Sheet withHeader={false} closeHandler={() => setOpenSheet(false)}>
                        <LayoutSheet setSheetOpen={setOpenSheet} />
                    </Sheet>,
                    document.querySelector('#modal-root')!
                )}

            <Sidebar />
            <Outlet />
        </main>
    );
};

export default Layout;