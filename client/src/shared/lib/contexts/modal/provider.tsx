import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '@/shared/ui/Modal';
import { ModalContext } from './context';
import { ModalConfig } from './types';

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modals, setModals] = React.useState<Array<ModalConfig>>([]);
    const [isAsyncActionLoading, setIsAsyncActionLoading] = React.useState(false);

    const openModal = React.useCallback((modal: ModalConfig) => {
        setModals((prevState) => [...prevState, modal]);
    }, []);
    
    const closeModal = React.useCallback(() => {
        setModals((prevState) => prevState.slice(0, -1));
    }, []);

    React.useEffect(() => {
        if (!modals.length) return;

        const handleKeyUp = ({ key }: KeyboardEvent) => {
            !isAsyncActionLoading && key === 'Escape' && closeModal();
        };

        document.body.style.paddingRight = window.innerWidth - document.body.offsetWidth + 'px';
        document.body.classList.add('overflow-hidden');

        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.body.classList.remove('overflow-hidden');
            document.body.style.paddingRight = '0';
        
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [isAsyncActionLoading, modals]);

    const value = React.useMemo(() => ({
        isAsyncActionLoading,
        setIsAsyncActionLoading,
        openModal,
        closeModal
    }), [closeModal, isAsyncActionLoading, openModal]);

    return (
        <ModalContext.Provider value={value}>
            {modals.map((modal) => ReactDOM.createPortal(
                <Modal key={modal.id} {...modal} closeHandler={closeModal}>
                    {modal.content}
                </Modal>, document.querySelector('#modal-root')!
            ))}
            {children}
        </ModalContext.Provider>
    );
};
