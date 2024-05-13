import React from 'react';
import Typography from './Typography';
import { ModalBodyProps, ModalProps } from '@/shared/model/types';
import { XIcon } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils/cn';
import { useModal } from '../lib/hooks/useModal';

const modalVariants = cva(
    'flex flex-col gap-5 overflow-auto dark:bg-primary-dark-100 dark:border-primary-dark-200 bg-white rounded-lg box-border border border-solid border-primary-gray',
    {
        variants: {
            size: {
                default: 'w-full h-full max-w-[750px] max-h-[600px] p-8',
                sm: 'w-full h-full max-w-[550px] max-h-[400px] p-5',
                lg: 'w-full h-full max-w-[900px] max-h-[700px] p-10',
                fitHeight: 'max-w-[750px] w-full h-auto p-8 max-h-[600px]',
                fit: 'w-auto h-auto p-8 max-h-[600px]',
                screen: 'w-full h-full p-8'
            }
        },
        defaultVariants: {
            size: 'default'
        }
    }
);

const ModalHeader = ({ title, closeHandler }: Omit<ModalProps, 'children'>) => {
    const { isAsyncActionLoading } = useModal();

    return (
        <>
            {title ? (
                <div className='flex items-center justify-between w-full'>
                    <Typography variant='primary' size='3xl' weight='bold'>
                        {title}
                    </Typography>
                    <button onClick={closeHandler} disabled={isAsyncActionLoading}>
                        <XIcon className='dark:text-white' />
                    </button>
                </div>
            ) : (
                <button onClick={closeHandler} className='self-end' disabled={isAsyncActionLoading}>
                    <XIcon className='dark:text-white' />
                </button>
            )}
        </>
    );
};

const ModalContainer = ({ children, closeHandler }: Omit<ModalProps, 'title'>) => {
    const { isAsyncActionLoading } = useModal();

    React.useEffect(() => {
        const handleKeyUp = ({ key }: KeyboardEvent) => {
            !isAsyncActionLoading && key === 'Escape' && closeHandler();
        };

        document.body.style.paddingRight = window.innerWidth - document.body.offsetWidth + 'px';
        document.body.classList.add('overflow-hidden');
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.body.classList.remove('overflow-hidden');
            document.body.style.paddingRight = '0';
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [isAsyncActionLoading, closeHandler]);

    const handleOverlayClick = ({ target, currentTarget }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        !isAsyncActionLoading && target === currentTarget && closeHandler();
    };

    return (
        <div className='fixed inset-0 bg-modal z-[9999] flex items-center justify-center' onClick={handleOverlayClick}>
            {children}
        </div>
    );
};

const ModalBody = ({ children, size, className, ...rest }: Omit<ModalBodyProps, 'closeHandler'>) => {
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
        <div ref={bodyRef} onKeyDown={handleKeyDown} className={cn(modalVariants({ size, className }))} {...rest}>
            {children}
        </div>
    );
};

const Modal = ({ closeHandler, title, children, size }: ModalProps) => {
    return (
        <ModalContainer closeHandler={closeHandler}>
            <ModalBody size={size}>
                <ModalHeader title={title} closeHandler={closeHandler} />
                {children}
            </ModalBody>
        </ModalContainer>
    );
};

export default Modal;