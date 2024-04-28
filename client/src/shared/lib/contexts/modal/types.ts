export interface ModalContextProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: (config: ModalConfig) => void;
    closeModal: () => void;
}

export interface ModalConfig {
    title?: string;
    content: React.ReactNode;
}