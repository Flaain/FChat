import React from 'react';
import { FeedTypes } from '@/shared/model/types';
import { Button } from '@/shared/ui/Button';
import { X } from 'lucide-react';
import { useDomEvents } from '@/shared/model/store';
import { Typography } from '@/shared/ui/Typography';

const titles: Record<Exclude<FeedTypes, 'User'>, string> = {
    Conversation: 'User Info',
    Group: 'Group Info'
};

export const OutletDetails = ({
    onClose,
    avatarSlot,
    name,
    description,
    type,
    info,
}: {
    name: string;
    description?: string;
    info?: React.ReactNode;
    avatarSlot: React.ReactNode;
    type: FeedTypes;
    onClose: () => void;
}) => {
    const addEventListener = useDomEvents((state) => state.addEventListener);

    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (!containerRef.current) return;

        const removeEventListener = addEventListener('keydown', (event) => {
            event.stopImmediatePropagation();

            event.key === 'Escape' && onClose();
        });

        return () => {
            removeEventListener();
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
                {avatarSlot}
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