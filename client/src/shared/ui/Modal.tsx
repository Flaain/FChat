import React from "react";
import Typography from "./Typography";
import { ModalBodyProps, ModalProps } from "@/shared/model/types";
import { XIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils/cn";

const modalVariants = cva(
    "flex flex-col gap-5 overflow-auto dark:bg-primary-dark-100 dark:border-primary-dark-200 bg-white rounded-lg box-border border border-solid border-primary-gray",
    {
        variants: {
            size: {
                default: "w-full h-full max-w-[750px] max-h-[600px] p-8",
                sm: "w-full h-full max-w-[550px] max-h-[400px] p-5",
                lg: "w-full h-full max-w-[900px] max-h-[700px] p-10",
                fitHeight: "max-w-[750px] w-full h-auto p-8 max-h-[600px]",
                screen: "w-full h-full p-8",
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
);

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

const ModalBody = ({ children, size, className, ...rest }: ModalBodyProps) => {
    return (
        <div className={cn(modalVariants({ size, className }))} {...rest}>
            {children}
        </div>
    );
};

const Modal = ({ closeHandler, title, children, size }: ModalProps) => {
    return (
        <ModalContainer closeHandler={closeHandler}>
            <ModalBody size={size}>
                <ModalHeader title={title} closeHandler={closeHandler} />
                {children}
            </ModalBody>
        </ModalContainer>
    );
};

export default Modal;