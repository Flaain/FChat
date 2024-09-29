import React from 'react';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { X } from 'lucide-react';
import { MessageTopBarProps } from '../../model/types';
import { markdownCompiler } from '@/shared/lib/utils/markdownCompiler';
import { PartOfCompilerUse } from '@/shared/model/types';
import { useEvents } from '@/shared/lib/providers/events/context';

export const TopBar = ({ onClose, title, mainIconSlot, closeIconSlot, description, preventClose }: MessageTopBarProps) => {
    const { addEventListener } = useEvents();

    React.useEffect(() => {
        const removeEventListener = addEventListener('keydown', (event) => {
            !preventClose && event.key === 'Escape' && onClose();
        });

        return () => {
            removeEventListener();
        };
    }, [])

    return (
        <div className='overscroll-contain border-b border-solid dark:border-primary-dark-50 border-primary-gray w-full flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out py-3 px-4 gap-4 box-border'>
            {mainIconSlot}
            <div className='flex flex-col w-full'>
                <Typography size='md' weight='medium' variant='primary'>
                    {title}
                </Typography>
                {description && (
                    <Typography as='p' variant='secondary' className='line-clamp-1'>
                        {markdownCompiler(description, PartOfCompilerUse.MESSAGE_TOP_BAR)}
                    </Typography>
                )}
            </div>
            <Button variant='text' className='ml-auto pr-0' onClick={onClose} disabled={preventClose}>
                {closeIconSlot ?? <X className='w-6 h-6' />}
            </Button>
        </div>
    );
};