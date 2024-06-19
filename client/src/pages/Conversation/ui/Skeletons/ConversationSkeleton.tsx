import { cn } from '@/shared/lib/utils/cn';

const ConversationSkeleton = () => {
    return (
        <div className='flex flex-col flex-1 h-svh overflow-auto gap-5 items-center justify-start dark:bg-primary-dark-200 bg-primary-white'>
            <div className='min-h-[70px] flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0 z-[999]'></div>
            <ul className='flex flex-col w-full px-5 gap-5'>
                {[...new Array(12)].map((_, index) => (
                    <li
                        key={index}
                        className={cn('flex items-center w-full gap-5', index % 2 ? 'justify-end' : 'justify-start')}
                    >
                        {!(index % 2) && (
                            <span className='self-end dark:bg-primary-dark-50 min-w-[50px] h-[50px] space-y-5 rounded-full relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200/10 before:to-transparent overflow-hidden isolate before:border-t before:border-primary-gray/30'></span>
                        )}
                        <span
                            style={{ height: `${Math.floor(Math.random() * 101) + 35}px` }}
                            className='box-border pl-5 pr-12 py-1 mt-2 max-w-[500px] flex items-end gap-3 self-start dark:bg-primary-dark-50 w-full space-y-5 rounded-xl relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200/10 before:to-transparent overflow-hidden isolate before:border-t before:border-primary-gray/30'
                        ></span>
                    </li>
                ))}
            </ul>
            <div className='sticky bottom-0 w-full min-h-[70px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out box-border'></div>
        </div>
    );
};

export default ConversationSkeleton;