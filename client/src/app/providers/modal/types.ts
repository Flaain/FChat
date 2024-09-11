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

export interface AsyncActionParams<T> {
    promise: Promise<T>;
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
    onAsyncActionModal: <T>(params: AsyncActionParams<T>) => Promise<T>;
}

export interface ModalConfig {
    title?: string;
    withCloseButton?: boolean;
    withHeader?: boolean;
    bodyClassName?: string;
    content: React.ReactNode;
}