import { Feed } from '@/widgets/Feed/ui/ui';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { AlignJustifyIcon, X } from 'lucide-react';
import { SidebarProps } from '../model/types';
import { useSidebar } from '../lib/useSidebar';
import { useLayout } from '@/shared/lib/providers/layout/context';

export const Sidebar = (props: SidebarProps) => {
    const { handleSearch, searchInputRef, handleLogout, resetSearch, feed } = useSidebar();
    const { onSheet } = useLayout();
    

    return (
        <aside className='flex flex-col h-screen sticky top-0 gap-2 dark:bg-primary-dark-150 bg-primary-white max-w-[420px] w-full border-r-2 border-r-primary-dark-50 border-solid'>
            <div className='flex items-center justify-between gap-5 sticky top-0 py-4 px-3 box-border h-[70px]'>
                <Button variant='text' size='icon' onClick={() => onSheet(true)} className='opacity-30'>
                    <AlignJustifyIcon />
                </Button>
                <Input
                    ref={searchInputRef}
                    onChange={handleSearch}
                    value={feed.searchValue}
                    placeholder='Search...'
                    className='pr-9 focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                />
                {!!feed.searchValue.trim().length && (
                    <Button variant='text' size='icon' onClick={resetSearch} className='p-0 absolute right-6'>
                        <X className='w-5 h-5' />
                    </Button>
                )}
            </div>
            <Feed {...feed} />
            <div className='mt-auto dark:bg-primary-dark-100 sticky bottom-0 py-4 px-3 max-h-[70px] box-border'>
                <Button onClick={handleLogout} variant='secondary' className='w-full'>
                    Logout
                </Button>
            </div>
        </aside>
    );
};