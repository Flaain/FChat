import React from 'react';
import { cva } from 'class-variance-authority';
import { PolymorphicRef, TypographyComponent, TypographyProps } from '../model/types';
import { cn } from '../lib/utils/cn';

const typographyVariants = cva(undefined, {
    variants: {
        variant: {
            primary: 'dark:text-primary-white text-primary-dark-200',
            secondary: 'dark:text-primary-white/30 text-primary-gray',
            commerce: 'text-primary-commerce',
            error: 'text-primary-destructive'
        },
        size: {
            base: 'text-base',
            sm: 'text-sm',
            md: 'text-md',
            lg: 'text-lg max-lg:text-base',
            xl: 'text-xl max-lg:text-lg',
            '2xl': 'text-2xl max-lg:text-xl',
            '3xl': 'text-3xl max-lg:text-2xl',
            '4xl': 'text-4xl max-lg:text-3xl',
            '5xl': 'text-5xl max-lg:text-4xl max-md:text-3xl',
            '6xl': 'text-6xl max-lg:text-4xl max-md:text-3xl'
        },
        weight: {
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
            extrabold: 'font-extrabold'
        }
    },
    defaultVariants: {
        variant: 'primary',
        size: 'base',
        weight: 'normal'
    }
});

const Typography: TypographyComponent = React.forwardRef(
    <T extends React.ElementType = 'span'>(props: TypographyProps<T>, ref: PolymorphicRef<T>) => {
        const { as, variant, size, children, weight, className, ...rest } = props;

        const Component = as ?? 'span';

        return (
            <Component
                ref={ref}
                className={cn(typographyVariants({ variant, size, weight, className }))}
                {...rest}
            >
                {children}
            </Component>
        );
    }
);

export default Typography;