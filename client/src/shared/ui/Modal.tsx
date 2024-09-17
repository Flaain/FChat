import React from 'react';
import { XIcon } from 'lucide-react';
import { cn } from '../lib/utils/cn';
import { Typography } from './Typography';
import { ModalBodyProps, ModalProps } from '../lib/providers/modal/types';

const ModalHeader = ({
    title,
    withCloseButton,
    closeHandler,
    disabled
}: Omit<ModalProps, 'children' | 'bodyClassName' | 'size' | 'withHeader'>) => {
    if (!title && !withCloseButton) {
        throw new Error('Please use at least one of title or withCloseButton props or provide falsy withHeader prop');
    }

    if (title && !withCloseButton) {
        return (
            <Typography variant='primary' size='3xl' weight='bold'>
                {title}
            </Typography>
        );
    }

    return (
        <>
            {title ? (
                <div className='flex items-center justify-between w-full'>
                    <Typography variant='primary' size='3xl' weight='bold'>
                        {title}
                    </Typography>
                    <button onClick={closeHandler} disabled={disabled}>
                        <XIcon className='dark:text-white' />
                    </button>
                </div>
            ) : (
                <button onClick={closeHandler} className='self-end' disabled={disabled}>
                    <XIcon className='dark:text-white' />
                </button>
            )}
        </>
    );
};

const ModalContainer = ({ children, closeHandler, disabled }: Omit<ModalProps, 'title' | 'withHeader' | 'withCloseButton' | 'bodyClassName' | 'size'>) => {
    const handleOverlayClick = ({ target, currentTarget }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        !disabled && target === currentTarget && closeHandler();
    };

    return (
        <div className={cn('fixed inset-0 z-[9999]', disabled && 'pointer-events-none')}>
            <div className='w-full h-full flex items-center justify-center p-5 bg-modal' onClick={handleOverlayClick}>
                {children}
            </div>
        </div>
    );
};

const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(({ children, className, disabled, ...rest }, ref) => {
    return (
        <div ref={ref} tabIndex={-1} className={cn('outline-none', className, disabled && 'pointer-events-none')} {...rest}>
            {children}
        </div>
    );
})

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(({ closeHandler, children, withHeader = true, withCloseButton = true, ...config }, ref) => {
    return (
        <ModalContainer closeHandler={closeHandler}>
            <ModalBody ref={ref} className={config.bodyClassName}>
                {withHeader && <ModalHeader title={config.title} withCloseButton={withCloseButton} closeHandler={closeHandler} />}
                {children}
            </ModalBody>
        </ModalContainer>
    );
})