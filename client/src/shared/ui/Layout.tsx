import ReactDOM from 'react-dom';
import Sheet from './Sheet';
import Sidebar from '@/widgets/Sidebar/ui/ui';
import LayoutSheet from '@/widgets/LayoutSheet/ui/ui';
import { Outlet } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './Resizable';
import { saveDataToLocalStorage } from '../lib/utils/saveDataToLocalStorage';
import { localStorageKeys } from '../constants';
import { getDataFromLocalStorage } from '../lib/utils/getDataFromLocalStorage';
import { Toaster } from 'sonner';
import { useLayoutContext } from '../lib/hooks/useLayoutContext';

const Layout = () => {
    const { openSheet, setOpenSheet } = useLayoutContext();

    return (
        <ResizablePanelGroup direction='horizontal' style={{ overflow: 'unset' }}>
            <main className='flex h-full dark:bg-primary-dark-200 w-full'>
                <Toaster />
                {openSheet &&
                    ReactDOM.createPortal(
                        <Sheet withHeader={false} closeHandler={() => setOpenSheet(false)}>
                            <LayoutSheet setSheetOpen={setOpenSheet} />
                        </Sheet>,
                        document.querySelector('#modal-root')!
                    )}
                <ResizablePanel
                    defaultSize={getDataFromLocalStorage({ key: localStorageKeys.ASIDE_PANEL_SIZE, defaultData: 20 })}
                    minSize={20}
                    maxSize={30}
                    style={{ overflow: 'unset' }}
                    onResize={(size) => saveDataToLocalStorage({ key: localStorageKeys.ASIDE_PANEL_SIZE, data: size })}
                >
                    <Sidebar />
                </ResizablePanel>
                <ResizableHandle className='w-1 dark:bg-primary-dark-50 dark:hover:bg-primary-50 transition-colors duration-200 ease-in-out' />
                <ResizablePanel className='flex' style={{ overflow: 'unset' }}>
                    <Outlet />
                </ResizablePanel>
            </main>
        </ResizablePanelGroup>
    );
};

export default Layout;