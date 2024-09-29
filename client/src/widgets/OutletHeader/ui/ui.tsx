import { cn } from '@/shared/lib/utils/cn';
import { Loader2, Verified } from 'lucide-react';
import { OutletHeaderProps } from '../model/types';
import { Typography } from '@/shared/ui/Typography';
import { useSocket } from '@/shared/lib/providers/socket/context';

export const OutletHeader = ({ name, isOfficial, description, dropdownMenu }: OutletHeaderProps) => {
    const { isConnected } = useSocket();

    return (
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
    );
};
