const SideConversationSkeleton = () => {
    return (
        <ul className="flex flex-col gap-5 overflow-auto scrollbar_type_conversation px-3">
            {[...new Array(5)].map((_, index, array) => (
                <li key={index} className='flex justify-between items-center' style={{ opacity: (array.length - index) / array.length }}>
                    <div className='flex items-center gap-5 w-full'>
                        <span className='dark:bg-primary-dark-50 min-w-[50px] h-[50px] space-y-5 rounded-full relative'></span>
                        <div className='flex flex-col gap-2 w-full'>
                            <span className='dark:bg-primary-dark-50 w-[80px] h-[10px] space-y-5 rounded-xl'></span>
                            <span className='dark:bg-primary-dark-50 w-full h-[15px] space-y-5 rounded-xl'></span>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default SideConversationSkeleton;
