import React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input, InputProps } from "./Input";
import { cn } from "../lib/utils/cn";
import { Button } from "./Button";

// const strengthTitles = {
//     1: { title: "Weak", color: "bg-red-500" },
//     2: { title: "Medium", color: "bg-yellow-500" },
//     3: { title: "Strong", color: "bg-green-500" },
//     4: { title: "Strong", color: "bg-green-500" },
// };

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps & { showStrength?: boolean }>(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    // const [strength, setStrength] = React.useState(0);

    const disabled = !props.value || !props.value.toString().trim().length || props.disabled;

    // React.useEffect(() => {
    //     setStrength(passwordRules.filter(({ rule }) => rule(props.value as string)).length);
    // }, [props.value]);

    return (
        <div className='relative'>
            <Input
                type={showPassword ? "text" : "password"}
                className={cn("hide-password-toggle pr-10", className)}
                ref={ref}
                {...props}
            />
            <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={disabled}
            >
                {showPassword && !disabled ? (
                    <EyeIcon className='h-4 w-4' aria-hidden='true' />
                ) : (
                    <EyeOffIcon className='h-4 w-4' aria-hidden='true' />
                )}
                <span className='sr-only'>{showPassword ? "Hide password" : "Show password"}</span>
            </Button>

            {/* hides browsers password toggles */}
            <style>{`
                .hide-password-toggle::-ms-reveal,
                .hide-password-toggle::-ms-clear {
                    visibility: hidden;
                    pointer-events: none;
                    display: none;
                }
            `}</style>
            {/* {showStrength && !!strength && (
                <span
                    className={cn(
                        "absolute bottom-0 left-0 right-2/3 h-2 rounded-bl-md",
                        strengthTitles[strength as keyof typeof strengthTitles].color
                    )}
                >
                    {strengthTitles[strength as keyof typeof strengthTitles].title}
                </span>
            )} */}
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };