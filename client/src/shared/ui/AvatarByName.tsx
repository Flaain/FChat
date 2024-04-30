const AvatarByName = ({ name }: { name: string }) => {
    const nameParts = name.split(" ");
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
    const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";

    return (
        <span className='w-[50px] h-[50px] flex justify-center items-center rounded-full dark:bg-primary-white bg-primary-dark-100 text-2xl font-bold dark:text-primary-dark-200 text-primary-white'>
            {firstNameInitial.toUpperCase()}
            {lastNameInitial.toUpperCase()}
        </span>
    );
};

export default AvatarByName;