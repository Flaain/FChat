import React, { HTMLAttributes } from 'react';
import Typography from './Typography';
import { SheetProps } from '@/shared/model/types';
import { XIcon } from 'lucide-react';
import { cn } from '../lib/utils/cn';

const SheetHeader = ({ title, closeHandler }: Pick<SheetProps, 'title' | 'closeHandler'>) => {
    return (
        <>
            {title ? (
                <div className='flex items-center justify-between w-full'>
                    <Typography variant='primary' size='3xl' weight='bold'>
                        {title}
                    </Typography>
                    <button onClick={closeHandler}>
                        <XIcon className='dark:text-white' />
                    </button>
                </div>
            ) : (
                <button onClick={closeHandler} className='self-end'>
                    <XIcon className='dark:text-white' />
                </button>
            )}
        </>
    );
};

const SheetContainer = ({
    children,
    direction = 'left',
    closeHandler
}: Omit<SheetProps, 'title' | 'withHeader'> & { direction?: 'left' | 'right' }) => {
    React.useEffect(() => {
        const handleKeyUp = ({ key }: KeyboardEvent) => {
            key === 'Escape' && closeHandler();
        };

        document.body.style.paddingRight = window.innerWidth - document.body.offsetWidth + 'px';
        document.body.classList.add('overflow-hidden');
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.body.classList.remove('overflow-hidden');
            document.body.style.paddingRight = '0';
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [closeHandler]);

    const handleOverlayClick = ({ target, currentTarget }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        target === currentTarget && closeHandler();
    };

    return (
        <div
            className={cn(
                'fixed inset-0 bg-modal z-[9999] flex items-center',
                direction === 'left' ? 'justify-start' : 'justify-end'
            )}
            onClick={handleOverlayClick}
        >
            {children}
        </div>
    );
};

const SheetBody = ({ children, className, ...rest }: Omit<SheetProps, 'closeHandler'> & HTMLAttributes<HTMLDivElement>) => {
    const bodyRef = React.useRef<HTMLDivElement | null>(null);
    const focusableElements = React.useRef<Array<HTMLElement>>([]);
    const activeIndex = React.useRef(-1);

    const handleTabDown = (event: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
        if (!bodyRef.current) return;

        event.preventDefault();
        event.stopPropagation();

        focusableElements.current = Array.from(
            bodyRef.current.querySelectorAll(
                'a, button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
            )
        );

        const total = focusableElements.current.length;
        const currentIndex = activeIndex.current;

        activeIndex.current = total ? (currentIndex + (event.shiftKey ? -1 : 1) + total) % total : -1;

        focusableElements.current[activeIndex.current]?.focus?.();
    };

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
        const keyListeners = {
            Tab: handleTabDown
        };

        keyListeners[event.key as keyof typeof keyListeners]?.(event);
    }, []);

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div
            ref={bodyRef}
            onKeyDown={handleKeyDown}
            className={cn(
                'flex flex-col w-full max-w-[300px] h-svh gap-5 overflow-auto shadow-md dark:shadow-primary-dark-150 shadow-primary-white dark:bg-primary-dark-100 bg-white box-border',
                className
            )}
            {...rest}
        >
            {children}
        </div>
    );
};

const Sheet = ({ direction, withHeader = true, closeHandler, title, children }: SheetProps) => {
    return (
        <SheetContainer direction={direction} closeHandler={closeHandler}>
            <SheetBody>
                {withHeader && <SheetHeader title={title} closeHandler={closeHandler} />}
                {children}
            </SheetBody>
        </SheetContainer>
    );
};

export default Sheet;