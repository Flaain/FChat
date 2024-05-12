import CreateConversation from '@/features/CreateConversation/ui/ui';
import ConversationsList from '@/widgets/ConversationsList/ui/ui';
import { Outlet } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './Resizable';
import { saveDataToLocalStorage } from '../lib/utils/saveDataToLocalStorage';
import { localStorageKeys } from '../constants';
import { getDataFromLocalStorage } from '../lib/utils/getDataFromLocalStorage';
import { Input } from './Input';
import { Button } from './Button';
import { Plus } from 'lucide-react';
import { useLayout } from '../lib/hooks/useLayout';
import { Toaster } from 'sonner';

const Layout = () => {
    const { searchValue, handleSearch, openModal, handleLogout } = useLayout();

    return (
        <ResizablePanelGroup direction='horizontal' style={{ overflow: 'unset' }}>
            <main className='flex dark:bg-primary-dark-200 w-full'>
                <Toaster />
                <ResizablePanel
                    defaultSize={getDataFromLocalStorage({ key: localStorageKeys.ASIDE_PANEL_SIZE, defaultData: 20 })}
                    minSize={20}
                    maxSize={30}
                    style={{ overflow: 'unset' }}
                    onResize={(size) => saveDataToLocalStorage({ key: localStorageKeys.ASIDE_PANEL_SIZE, data: size })}
                >
                    <aside className='flex flex-col h-screen sticky top-0 gap-8 dark:bg-primary-dark-150 bg-primary-white'>
                        <div className='flex items-center justify-between gap-2 sticky top-0 py-4 px-3'>
                            <Input
                                onChange={handleSearch}
                                value={searchValue}
                                placeholder='Search...'
                                className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                            />
                            <Button
                                variant='text'
                                size='icon'
                                onClick={() =>
                                    openModal({
                                        title: 'New conversation',
                                        content: <CreateConversation />,
                                        size: 'fitHeight'
                                    })
                                }
                            >
                                <Plus />
                            </Button>
                        </div>
                        <ConversationsList searchValue={searchValue} />
                        <div className='mt-auto dark:bg-primary-dark-100 sticky bottom-0 py-4 px-3 max-h-[70px] box-border'>
                            <Button onClick={handleLogout} variant='secondary' className='w-full'>
                                Logout
                            </Button>
                        </div>
                    </aside>
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