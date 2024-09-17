import { cn } from '@/shared/lib/utils/cn';
import { Loader2, Verified } from 'lucide-react';
import { OutletHeaderProps } from '../model/types';
import { useSocket } from '@/shared/lib/hooks/useSocket';
import { Typography } from '@/shared/ui/Typography';

export const OutletHeader = ({ name, isOfficial, description, dropdownMenu, ...rest }: OutletHeaderProps) => {
    const { isConnected } = useSocket();

    return (
        <div
            {...rest}
            className='cursor-pointer flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0 z-[999]'
        >
            <div className='flex flex-col items-start w-full gap-1'>
                <div className='flex items-center justify-between w-full'>
                    <Typography
                        as='h2'
                        size='lg'
                        weight='medium'
                        variant='primary'
                        className={cn(isOfficial && 'flex items-center gap-2')}
                    >
                        {name}
                        {isOfficial && (
                            <Typography>
                                <Verified className='w-5 h-5' />
                            </Typography>
                        )}
                    </Typography>
                    {dropdownMenu}
                </div>
                {isConnected ? (
                    <Typography as='p' variant='secondary'>
                        {description}
                    </Typography>
                ) : (
                    <Typography className='flex items-center gap-2'>
                        <Loader2 className='w-5 h-5 animate-spin' />
                        Connecting...
                    </Typography>
                )}
            </div>
        </div>
    );
};