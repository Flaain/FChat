import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '@/shared/ui/Modal';
import { ModalContext } from './context';
import { ModalConfig } from './types';
import { useDomEvents } from '../../hooks/useDomEvents';

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const { addEventListener } = useDomEvents();

    const [modals, setModals] = React.useState<Array<ModalConfig>>([]);
    const [isAsyncActionLoading, setIsAsyncActionLoading] = React.useState(false);
    
    const bodyRef = React.useRef<HTMLDivElement | null>(null);
    const focusableElements = React.useRef<Array<HTMLElement>>([]);
    const activeIndex = React.useRef(-1);
    
    const openModal = React.useCallback((modal: ModalConfig) => {
        setModals((prevState) => [...prevState, modal]);
    }, []);
    
    const closeModal = React.useCallback(() => {
        setModals((prevState) => prevState.slice(0, -1));
    }, []);

    const handleTabDown = (event: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
        if (!bodyRef.current) return;

        bodyRef.current.focus();

        event.preventDefault();

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

    const handleEscapeDown = (event: KeyboardEvent) => {
        !isAsyncActionLoading && event.key === 'Escape' && closeModal();
    };


    const handleKeyDown = (event: KeyboardEvent) => {
        event.stopImmediatePropagation();
        
        const keyListeners = {
            Tab: handleTabDown,
            Escape: handleEscapeDown,
        };

        keyListeners[event.key as keyof typeof keyListeners]?.(event);
    };

    React.useEffect(() => {
        if (!modals.length || !bodyRef.current) return;

        bodyRef.current.focus();

        document.body.style.paddingRight = window.innerWidth - document.body.offsetWidth + 'px';
        document.body.classList.add('overflow-hidden');

        const removeEventListener = addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.classList.remove('overflow-hidden');
            document.body.style.paddingRight = '0';
        
            removeEventListener();
        };
    }, [isAsyncActionLoading, modals, handleKeyDown]);

    const value = React.useMemo(() => ({ isAsyncActionLoading, setIsAsyncActionLoading, openModal, closeModal }), [isAsyncActionLoading]);

    return (
        <ModalContext.Provider value={value}>
            {modals.map((modal, index, array) => ReactDOM.createPortal(
                <Modal ref={index ===  array.length - 1 ? bodyRef : null} key={index} {...modal} closeHandler={closeModal}>
                    {modal.content}
                </Modal>, document.querySelector('#modal-root')!
            ))}
            {children}
        </ModalContext.Provider>
    );
};