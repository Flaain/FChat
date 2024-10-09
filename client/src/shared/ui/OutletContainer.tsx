import React from 'react';

export const OutletContainer = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children }, ref) => {
    return (
        <section
            ref={ref}
            className='w-full flex overflow-auto items-center justify-start dark:bg-primary-dark-200 bg-primary-white z-10'
        >
            {children}
        </section>
    );
});