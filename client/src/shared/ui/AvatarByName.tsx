const AvatarByName = ({ name }: { name: string }) => (
    <span className='w-[50px] h-[50px] flex justify-center items-center rounded-full dark:bg-primary-white bg-primary-dark-100 text-2xl font-bold dark:text-primary-dark-200 text-primary-white'>
        {name[0].toUpperCase()}
    </span>
);

export default AvatarByName;