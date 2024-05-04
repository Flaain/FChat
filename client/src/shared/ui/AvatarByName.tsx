import { cn } from "../lib/utils/cn";
import { AvatarByNameProps } from "../model/types";

const AvatarByName = ({ name, className, ...rest }: AvatarByNameProps) => {
    const nameParts = name.split(" ");
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
    const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";

    return (
        <span
            {...rest}
            className={cn(
                "min-w-[50px] min-h-[50px] flex justify-center items-center rounded-full dark:bg-primary-white bg-primary-dark-100 text-2xl font-bold dark:text-primary-dark-200 text-primary-white",
                className
            )}
        >
            {firstNameInitial.toUpperCase()}
            {lastNameInitial.toUpperCase()}
        </span>
    );
};

export default AvatarByName;