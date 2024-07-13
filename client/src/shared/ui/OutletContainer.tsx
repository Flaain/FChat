import React from 'react';

const OutletContainer = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children }, ref) => {
    return (
        <div
            ref={ref}
            className='flex flex-col flex-1 h-svh overflow-auto items-center justify-start dark:bg-primary-dark-200 bg-primary-white'
        >
            {children}
        </div>
    );
});

export default OutletContainer;