import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils/cn";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
    {
        variants: {
            variant: {
                default: "dark:bg-primary-white dark:text-primary-dark-200 dark:hover:bg-white/90 bg-primary-dark-50 text-primary-white hover:bg-primary-dark-50/90",
                secondary: "dark:bg-primary-dark-50 dark:text-primary-white dark:hover:bg-primary-dark-50/50",
                destructive: "bg-primary-destructive text-white hover:bg-primary-destructive/50",
                outline: "border border-primary-white text-primary-white dark:border-primary-dark-50",
                ghost: "text-primary-dark-200 hover:bg-primary-white dark:text-primary-white dark:hover:bg-primary-dark-50",
                link: "dark:text-primary-white text-primary-dark-200 hover:underline hover:underline-offset-2",
                commerce: "bg-primary-commerce text-primary-white hover:bg-primary-commerce/90",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };