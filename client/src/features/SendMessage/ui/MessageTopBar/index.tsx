import Typography from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { X } from 'lucide-react';
import { MessageTopBarProps } from '../../model/types';

const MessageTopBar = ({
    onClose,
    title,
    mainIconSlot,
    closeIconSlot,
    description,
    preventClose
}: MessageTopBarProps) => {
    return (
        <div className='overscroll-contain border-b border-solid dark:border-primary-dark-50 border-primary-gray w-full flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out py-3 px-4 gap-4 box-border'>
            {mainIconSlot}
            <div className='flex flex-col w-full'>
                <Typography as='p' size='md' weight='medium' variant='primary'>
                    {title}
                </Typography>
                {description && (
                    <Typography as='p' variant='secondary' className='line-clamp-1'>
                        {description}
                    </Typography>
                )}
            </div>
            <Button variant='text' className='ml-auto pr-0' onClick={onClose} disabled={preventClose}>
                {closeIconSlot ?? <X className='w-6 h-6' />}
            </Button>
        </div>
    );
};

export default MessageTopBar;