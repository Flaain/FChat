import { Loader2Icon } from 'lucide-react';

const ScreenLoader = () => (
    <div className='flex items-center justify-center h-svh w-full dark:text-primary-white text-primary-dark-100 dark:bg-primary-dark-200 bg-white'>
        <Loader2Icon className='w-10 h-10 animate-loading' />
    </div>
);

export default ScreenLoader;