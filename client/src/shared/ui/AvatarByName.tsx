import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils/cn';
import { AvatarByNameProps } from '../model/types';
import { User } from 'lucide-react';
import { ProfileIndicator }  from './ProfileIndicator';

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

export const AvatarByName = ({ name, className, children, size, isOnline, ...rest }: AvatarByNameProps) => {
    if (!name) {
        return (
            <span {...rest} className={cn(avatarVariants({ size, className }))}>
                {children || <User />}
            </span>
        );
    }

    const nameParts = name.split(' ');
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : '';
    const lastNameInitial = nameParts[1] ? nameParts[1][0] : '';

    return (
        <span {...rest} className={cn('relative', avatarVariants({ size, className }))}>
            {children || (
                <>
                    {firstNameInitial.toUpperCase()}
                    {lastNameInitial.toUpperCase()}
                </>
            )}
            {isOnline && <ProfileIndicator />}
        </span>
    );
};