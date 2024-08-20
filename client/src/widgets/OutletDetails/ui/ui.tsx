import React from "react";

const OutletDetails = ({ onClose, shouldCloseOnClickOutside = true }: { onClose: () => void, shouldCloseOnClickOutside?: boolean }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (!containerRef.current || !shouldCloseOnClickOutside) return;

        const handleClick = ({ target }: MouseEvent) => {
            target instanceof Node && !containerRef.current?.contains(target) && onClose();  
        }

        const handleKeyup = ({ key }: KeyboardEvent) => {
            key === 'Escape' && onClose();
        }

        document.addEventListener('keyup', handleKeyup);
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keyup', handleKeyup);
        }
    }, [])

    return (
        <div ref={containerRef} className='max-xl:absolute max-xl:top-0 max-xl:right-0 z-[999] px-5 py-3 dark:bg-primary-dark-50 h-full max-w-[390px] w-full border-l-2 border-primary-dark-50'>
            test details block
        </div>
    );
};

export default OutletDetails;