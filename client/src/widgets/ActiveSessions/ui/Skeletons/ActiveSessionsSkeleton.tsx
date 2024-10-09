import { PreAnimatedSkeleton } from '@/shared/ui/PreAnimatedSkeleton';

export const ActiveSessionsSkeleton = () => {
    return (
        <ul className='flex flex-col gap-5 overflow-auto pt-5 px-3'>
            {[...new Array(3)].map((_, index, array) => (
                <li
                    key={index}
                    className='flex justify-between items-center'
                    style={{ opacity: (array.length - index) / array.length }}
                >
                    <div className='flex items-center gap-5 w-full'>
                        <PreAnimatedSkeleton className='dark:bg-primary-dark-50 min-w-[50px] h-[50px] space-y-5 rounded-full self-start' />
                        <div className='flex flex-col gap-2 w-full'>
                            <PreAnimatedSkeleton className='dark:bg-primary-dark-50 w-[80px] h-[15px] space-y-5 rounded-xl' />
                            <PreAnimatedSkeleton className='dark:bg-primary-dark-50 w-full h-[50px] space-y-5 rounded-xl' />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};