import { ModalSize } from "@/shared/model/types";

export interface ModalContextProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: (config: ModalConfig) => void;
    closeModal: () => void;
}

export interface ModalConfig {
    title?: string;
    size?: ModalSize;
    content: React.ReactNode;
}