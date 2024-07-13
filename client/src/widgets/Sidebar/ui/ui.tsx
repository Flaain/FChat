import Feed from '@/widgets/Feed/ui/ui';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { AlignJustifyIcon } from 'lucide-react';
import { SidebarProps } from '../model/types';

const Sidebar = (props: SidebarProps) => {
    const { setOpenSheet, searchValue, handleSearch, searchInputRef, handleLogout } = useLayoutContext();

    return (
        <aside className='flex flex-col h-screen sticky top-0 gap-2 dark:bg-primary-dark-150 bg-primary-white max-w-[420px] w-full border-r-2 border-r-primary-dark-50 border-solid'>
            <div className='flex items-center justify-between gap-5 sticky top-0 py-4 px-3'>
                <Button variant='text' size='icon' onClick={() => setOpenSheet(true)} className='opacity-30'>
                    <AlignJustifyIcon />
                </Button>
                <Input
                    ref={searchInputRef}
                    onChange={handleSearch}
                    value={searchValue}
                    placeholder='Search...'
                    className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                />
            </div>
            <Feed />
            <div className='mt-auto dark:bg-primary-dark-100 sticky bottom-0 py-4 px-3 max-h-[70px] box-border'>
                <Button onClick={handleLogout} variant='secondary' className='w-full'>
                    Logout
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;