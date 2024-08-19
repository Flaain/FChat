import React from 'react';

const OutletContainer = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children }, ref) => {
    return (
        <div
            ref={ref}
            className='w-full flex overflow-auto items-center justify-start dark:bg-primary-dark-200 bg-primary-white'
        >
            {children}
        </div>
    );
});

export default OutletContainer;