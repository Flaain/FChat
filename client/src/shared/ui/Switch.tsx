import { HTMLAttributes } from 'react';
import { cn } from '../lib/utils/cn';

const Switch = ({
    onChange,
    checked,
    children,
    ...rest
}: HTMLAttributes<HTMLInputElement> & { checked?: boolean; children?: React.ReactNode }) => {
    return (
        <label className='h-10 px-4 py-2 text-primary-dark-200 hover:bg-primary-white dark:text-primary-white dark:hover:bg-primary-dark-50 flex items-center cursor-pointer rounded-none justify-start gap-4 w-full'>
            {children}
            <input {...rest} type='checkbox' className='sr-only' onChange={onChange} />
            <span
                className={cn(
                    'relative ml-auto dark:bg-primary-dark-150 bg-gray-200 h-5 w-10 rounded-full after:absolute after:top-1/2 after:-translate-y-1/2 after:duration-200 after:ease-in-out after:dark:bg-white after:bg-primary-dark-200 after:rounded-full after:h-4 after:w-4 after:transition-all',
                    checked ? 'after:right-1' : 'after:left-1'
                )}
            ></span>
        </label>
    );
};

export default Switch;