import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils/cn';
import { AvatarByNameProps } from '../model/types';
import { User } from 'lucide-react';

const avatarVariants = cva(
    'flex flex-grow-0 flex-shrink-0 basis-auto justify-center items-center rounded-full dark:bg-primary-white bg-primary-dark-100 font-bold dark:text-primary-dark-200 text-primary-white',
    {
        variants: {
            size: {
                sm: 'w-8 h-8 text-md',
                md: 'w-10 h-10 text-xl',
                lg: 'w-[50px] h-[50px] text-2xl',
                xl: 'w-14 h-14 text-3xl',
                '2xl': 'w-16 h-16 text-4xl'
            }
        },
        defaultVariants: {
            size: 'md'
        }
    }
);

const AvatarByName = ({ name, className, size, ...rest }: AvatarByNameProps) => {
    if (!name) {
        return (
            <span {...rest} className={cn(avatarVariants({ size, className }))}>
                <User />
            </span>
        );
    }

    const nameParts = name.split(' ');
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : '';
    const lastNameInitial = nameParts[1] ? nameParts[1][0] : '';

    return (
        <span {...rest} className={cn(avatarVariants({ size, className }))}>
            {firstNameInitial.toUpperCase()}
            {lastNameInitial.toUpperCase()}
        </span>
    );
};

export default AvatarByName;