import React from 'react';
import { Button } from '@/shared/ui/Button';
import { X } from 'lucide-react';
import { useDomEvents } from '@/shared/model/store';
import { Typography } from '@/shared/ui/Typography';
import { OutletDetailsProps } from '../model/types';
import { titles } from '../model/constants';

export const OutletDetails = ({ onClose, avatarSlot, name, description, type, info }: OutletDetailsProps) => {
    const addEventListener = useDomEvents((state) => state.addEventListener);

    React.useEffect(() => {
        const removeEventListener = addEventListener('keydown', (event) => {
            event.stopImmediatePropagation();

            event.key === 'Escape' && onClose();
        });

        return () => {
            removeEventListener();
        };
    }, []);

    return (
        <div className='flex flex-col gap-10 max-xl:absolute max-xl:top-0 max-xl:right-0 z-[999] px-5 py-3 dark:bg-primary-dark-100 h-full max-w-[390px] w-full border-l-2 border-primary-dark-50'>
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