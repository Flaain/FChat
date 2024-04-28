import React from "react";
import Modal from "@/shared/ui/Modal";
import { ModalContext } from "./context";
import { ModalConfig } from "./types";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [config, setConfig] = React.useState<ModalConfig | null>(null);

    const openModal = React.useCallback((config: ModalConfig) => {
        setIsModalOpen(true);
        setConfig(config);
    }, []);

    const closeModal = React.useCallback(() => {
        setIsModalOpen(false);
        setConfig(null);
    }, []);

    const value = React.useMemo(() => ({ isModalOpen, setIsModalOpen, openModal, closeModal }), [closeModal, isModalOpen, openModal]);

    return (
        <ModalContext.Provider value={value}>
            {isModalOpen && config?.content && (
                <Modal title={config?.title} closeHandler={() => setIsModalOpen(false)}>
                    {config.content}
                </Modal>
            )}
            {children}
        </ModalContext.Provider>
    );
};