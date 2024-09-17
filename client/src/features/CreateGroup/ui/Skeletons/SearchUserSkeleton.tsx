import { PreAnimatedSkeleton } from '@/shared/ui/PreAnimatedSkeleton';

export const SearchUserSkeleton = () => {
    return (
        <ul className='flex flex-col gap-5 overflow-auto max-h-[300px]'>
            {[...new Array(2)].map((_, index, array) => (
                <li
                    key={index}
                    className='flex justify-between items-center'
                    style={{ opacity: (array.length - index) / array.length }}
                >
                    <div className='flex items-center gap-4 w-full'>
                        <PreAnimatedSkeleton className='dark:bg-primary-dark-50 min-w-[40px] h-[40px] space-y-5 rounded-full' />
                        <PreAnimatedSkeleton className='dark:bg-primary-dark-50 w-[80px] h-[10px] space-y-5 rounded-xl' />
                    </div>
                </li>
            ))}
        </ul>
    );
};