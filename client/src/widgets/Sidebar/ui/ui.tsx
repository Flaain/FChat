import { Feed } from '@/widgets/Feed/ui/ui';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { AlignJustifyIcon, X } from 'lucide-react';
import { useLayout } from '@/shared/model/store';
import { useSidebar } from '../model/context';
import { useShallow } from 'zustand/shallow';
import { cn } from '@/shared/lib/utils/cn';

export const Sidebar = () => {
    const { ref, value, handleLogout, handleSearch, resetSearch } = useSidebar(useShallow((state) => ({
        ref: state.searchRef,
        value: state.searchValue,
        handleSearch: state.actions.handleSearch,
        resetSearch: state.actions.resetSearch,
        handleLogout: state.actions.handleLogout
    })));

    return (
        <aside className={cn('flex flex-col h-svh sticky top-0 gap-2 max-md:fixed dark:bg-primary-dark-150 bg-primary-white md:max-w-[420px] w-full border-r-2 border-r-primary-dark-50 border-solid')}>
            <div className='flex items-center justify-between gap-5 sticky top-0 py-4 px-3 box-border h-[70px]'>
                <Button
                    variant='text'
                    size='icon'
                    onClick={() => useLayout.setState({ isSheetOpen: true })}
                    className='opacity-30'
                >
                    <AlignJustifyIcon />
                </Button>
                <Input
                    ref={ref}
                    onChange={handleSearch}
                    value={value}
                    placeholder='Search...'
                    className='pr-9 focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                />
                {!!value.trim().length && (
                    <Button variant='text' size='icon' onClick={resetSearch} className='p-0 absolute right-6'>
                        <X className='w-5 h-5' />
                    </Button>
                )}
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