import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '@/shared/ui/Modal';
import { ModalContext } from './context';
import { AsyncFunctionParams, ModalConfig } from './types';
import { toast } from 'sonner';
import { ApiError } from '@/shared/api/error';

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [config, setConfig] = React.useState<ModalConfig | null>(null);
    const [isAsyncActionLoading, setIsAsyncActionLoading] = React.useState(false);

    const openModal = React.useCallback((config: ModalConfig) => {
        setIsModalOpen(true);
        setConfig(config);
    }, []);

    const closeModal = React.useCallback(() => {
        setIsModalOpen(false);
        setConfig(null);
    }, []);

    const onAsyncActionCall = React.useCallback(async ({ asyncAction, errorMessage }: AsyncFunctionParams) => {
        try {
            setIsAsyncActionLoading(true);

            await asyncAction();

            closeModal();
            setConfig(null);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                const isApiError = error instanceof ApiError;

                toast.error(isApiError ? error.message : errorMessage ?? error.message, { position: 'top-center' });
            }
        } finally {
            setIsAsyncActionLoading(false);
        }
    }, [closeModal]);

    const value = React.useMemo(
        () => ({
            isModalOpen,
            isAsyncActionLoading,
            onAsyncActionCall,
            setIsModalOpen,
            openModal,
            closeModal
        }),
        [closeModal, isAsyncActionLoading, isModalOpen, openModal, onAsyncActionCall]
    );

    return (
        <ModalContext.Provider value={value}>
            {isModalOpen &&
                config?.content &&
                ReactDOM.createPortal(
                    <Modal size={config.size} title={config.title} closeHandler={() => setIsModalOpen(false)}>
                        {config.content}
                    </Modal>,
                    document.querySelector('#modal-root')!
                )}
            {children}
        </ModalContext.Provider>
    );
};