import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '@/shared/ui/Modal';
import { ModalContext } from './context';
import { AsyncFunctionParams, ModalConfig } from './types';

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [config, setConfig] = React.useState<ModalConfig | null>(null);
    const [isAsyncActionLoading, setIsAsyncActionLoading] = React.useState(false);

    const openModal = React.useCallback((config: ModalConfig) => {
        setIsModalOpen(true);
        setConfig(config);
    }, []);

    const handleChangeTitle = React.useCallback((title: string) => {
        setConfig((prevState) => ({ ...prevState!, title }));
    }, []);

    const closeModal = React.useCallback(() => {
        setIsModalOpen(false);
        setConfig(null);
    }, []);

    const onAsyncActionCall = React.useCallback(async ({ asyncAction, errorMessage, closeModalOnError, closeModalOnSuccess = true }: AsyncFunctionParams) => {
        try {
            setIsAsyncActionLoading(true);

            await asyncAction();

            closeModalOnSuccess && closeModal();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) throw new Error(errorMessage ?? error.message);
            closeModalOnError && closeModal();
        } finally {
            setIsAsyncActionLoading(false);
        }
    }, [closeModal]);

    const value = React.useMemo(
        () => ({
            isModalOpen,
            isAsyncActionLoading,
            setIsAsyncActionLoading,
            onAsyncActionCall,
            setIsModalOpen,
            openModal,
            handleChangeTitle,
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