import Typography from '@/shared/ui/Typography';
import PreAnimatedSkeleton from '@/shared/ui/PreAnimatedSkeleton';
import { cn } from '@/shared/lib/utils/cn';
import { ConversationParticipant, UserFeed } from '@/shared/model/types';
import { Verified } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ConversationSkeleton = () => {
    const { state } = useLocation<ConversationParticipant | UserFeed>();

    return (
        <div className='flex flex-col flex-1 h-svh overflow-hidden gap-5 items-center justify-start dark:bg-primary-dark-200 bg-primary-white'>
            <div className='min-h-[70px] flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0 z-[999]'>
                {state && (
                    <Typography
                        as='h2'
                        size='lg'
                        weight='medium'
                        variant='primary'
                        className={cn(state.isOfficial && 'flex items-center gap-2')}
                    >
                        {state.name}
                        {state.isOfficial && (
                            <Typography>
                                <Verified className='w-5 h-5' />
                            </Typography>
                        )}
                    </Typography>
                )}
            </div>
            <ul className='flex flex-col w-full px-5 gap-5'>
                {[...new Array(12)].map((_, index) => (
                    <li
                        key={index}
                        className={cn('flex items-center w-full gap-5', index % 2 ? 'justify-end' : 'justify-start')}
                    >
                        {!(index % 2) && (
                            <PreAnimatedSkeleton className='self-end dark:bg-primary-dark-50/50 min-w-[50px] h-[50px] space-y-5 rounded-full' />
                        )}
                        <PreAnimatedSkeleton
                            style={{ height: `${Math.floor(Math.random() * 101) + 35}px` }}
                            className='dark:bg-primary-dark-50/50 box-border pl-5 pr-12 py-1 mt-2 w-full rounded-xl max-w-[500px] flex items-end gap-3 self-start'
                        />
                    </li>
                ))}
            </ul>
            <div className='sticky bottom-0 w-full min-h-[70px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out box-border'></div>
        </div>
    );
};

export default ConversationSkeleton;