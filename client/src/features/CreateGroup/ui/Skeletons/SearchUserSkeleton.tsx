const SearchUserSkeleton = () => {
    return (
        <ul className='flex flex-col gap-5 overflow-auto max-h-[300px]'>
            {[...new Array(2)].map((_, index, array) => (
                <li
                    key={index}
                    className='flex justify-between items-center'
                    style={{ opacity: (array.length - index) / array.length }}
                >
                    <div className='flex items-center gap-4 w-full'>
                        <span className='dark:bg-primary-dark-50 min-w-[40px] h-[40px] space-y-5 rounded-full relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200/10 before:to-transparent overflow-hidden isolate before:border-t before:border-primary-gray/30'></span>
                        <span className='dark:bg-primary-dark-50 w-[80px] h-[10px] space-y-5 rounded-xl relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200/10 before:to-transparent overflow-hidden isolate before:border-t before:border-primary-gray/30'></span>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default SearchUserSkeleton;