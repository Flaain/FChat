import React from "react";
import { ModalProps } from "@/shared/model/types";
import { XIcon } from "lucide-react";
import Typography from "./Typography";

const ModalHeader = ({ title, closeHandler }: Omit<ModalProps, "children">) => {
    return (
        <>
            {title ? (
                <div className='flex items-center justify-between w-full'>
                    <Typography variant='primary' size='3xl' weight='bold'>
                        {title}
                    </Typography>
                    <button onClick={closeHandler}>
                        <XIcon className='dark:text-white' />
                    </button>
                </div>
            ) : (
                <button onClick={closeHandler} className='self-end'>
                    <XIcon className='dark:text-white' />
                </button>
            )}
        </>
    );
};

const ModalContainer = ({ children, closeHandler }: Omit<ModalProps, "title">) => {
    React.useEffect(() => {
        const handleKeyUp = ({ key }: KeyboardEvent) => {
            key === "Escape" && closeHandler();
        };

        document.body.style.paddingRight = window.innerWidth - document.body.offsetWidth + "px";
        document.body.classList.add("overflow-hidden");
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.body.classList.remove("overflow-hidden");
            document.body.style.paddingRight = "0";
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const handleOverlayClick = ({ target, currentTarget }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        target === currentTarget && closeHandler();
    };

    return (
        <div className='fixed inset-0 bg-modal z-[9999] flex items-center justify-center' onClick={handleOverlayClick}>
            {children}
        </div>
    );
};

const ModalBody = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex flex-col gap-5 max-h-[600px] max-w-[750px] overflow-auto w-full h-full dark:bg-primary-dark-100 dark:border-primary-dark-200 bg-white rounded-lg p-8 box-border border border-solid border-primary-gray'>
            {children}
        </div>
    );
};

const Modal = ({ closeHandler, title, children }: ModalProps) => {
    return (
        <ModalContainer closeHandler={closeHandler}>
            <ModalBody>
                <ModalHeader title={title} closeHandler={closeHandler} />
                {children}
            </ModalBody>
        </ModalContainer>
    );
};

export default Modal;