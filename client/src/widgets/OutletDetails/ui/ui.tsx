import React from 'react';
import Typography from '@/shared/ui/Typography';
import AvatarByName from '@/shared/ui/AvatarByName';
import { FeedTypes } from '@/shared/model/types';
import { Button } from '@/shared/ui/Button';
import { X } from 'lucide-react';

const titles: Record<Exclude<FeedTypes, 'user'>, string> = {
    conversation: 'User Info',
    group: 'Group Info'
};

const OutletDetails = ({
    onClose,
    name,
    description,
    type,
    info,
    shouldCloseOnClickOutside = true
}: {
    description?: string;
    info?: React.ReactNode;
    name: string;
    type: FeedTypes;
    onClose: () => void;
    shouldCloseOnClickOutside?: boolean;
}) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (!containerRef.current) return;

        const handleClick = ({ target }: MouseEvent) => {
            target instanceof Node && !containerRef.current?.contains(target) && onClose();
        };

        const handleKeyup = ({ key }: KeyboardEvent) => {
            key === 'Escape' && onClose();
        };

        document.addEventListener('keyup', handleKeyup);
        shouldCloseOnClickOutside && document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keyup', handleKeyup);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className='flex flex-col gap-10 max-xl:absolute max-xl:top-0 max-xl:right-0 z-[999] px-5 py-3 dark:bg-primary-dark-100 h-full max-w-[390px] w-full border-l-2 border-primary-dark-50'
        >
            <div className='flex items-center gap-5'>
                <Button onClick={onClose} size='icon' variant='text' className='p-0'>
                    <X />
                </Button>
                <Typography weight='semibold' size='xl'>
                    {titles[type as keyof typeof titles]}
                </Typography>
            </div>
            <div className='flex flex-col items-center justify-center'>
                <AvatarByName name={name} size='5xl' />
                <Typography weight='semibold' size='xl' className='mt-2'>
                    {name}
                </Typography>
                {description && (
                    <Typography as='p' variant='secondary'>
                        {description}
                    </Typography>
                )}
            </div>
            {info}
        </div>
    );
};

export default OutletDetails;