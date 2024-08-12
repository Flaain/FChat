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
                '2xl': 'w-16 h-16 text-4xl',
                '3xl': 'w-20 h-20 text-5xl',
                '4xl': 'w-24 h-24 text-6xl',
                '5xl': 'w-28 h-28 text-7xl'
            }
        },
        defaultVariants: {
            size: 'md'
        }
    }
);

const AvatarByName = ({ name, className, size, isOnline, ...rest }: AvatarByNameProps) => {
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
        <span {...rest} className={cn('relative', avatarVariants({ size, className }))}>
            {firstNameInitial.toUpperCase()}
            {lastNameInitial.toUpperCase()}
            {isOnline && <span className='absolute right-0 bottom-0 h-3 w-3 rounded-full bg-green-500 border-2 border-solid dark:border-primary-dark-50'></span>}
        </span>
    );
};

export default AvatarByName;