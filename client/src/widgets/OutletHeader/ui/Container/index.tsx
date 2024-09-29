import { cn } from '@/shared/lib/utils/cn';

export const OutletHeaderContainer = ({
    children,
    className,
    ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
    <div
        {...rest}
        className={cn(
            'flex items-center self-start w-full h-[70px] px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0 z-[999]',
            className
        )}
    >
        {children}
    </div>
);