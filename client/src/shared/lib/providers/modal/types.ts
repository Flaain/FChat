import React from "react";

export interface ModalProps extends Omit<ModalConfig, 'content'> {
    disabled?: boolean;
    closeHandler: () => void;
    children: React.ReactNode;
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    disabled?: boolean;
}

export interface AsyncActionOptions<T> {
    closeOnError?: boolean;
    disableOnPending?: boolean;
    onResolve?: (data: T) => void;
    onReject?: (error: unknown) => void;
}

export interface ModalStore {
    isModalDisabled?: boolean;
    modals: Array<ModalConfig>;
    onOpenModal: (config: ModalConfig) => void;
    onCloseModal: () => void;
    onAsyncActionModal: <T>(cb: () => Promise<T>, options?: AsyncActionOptions<T>) => Promise<T | void>;
}

export interface ModalConfig {
    title?: string;
    withCloseButton?: boolean;
    withHeader?: boolean;
    bodyClassName?: string;
    content: React.ReactNode;
}