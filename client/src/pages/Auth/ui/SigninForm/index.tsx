import { PasswordInput } from "@/shared/ui/PasswordInput";
import { useSignin } from "../../lib/hooks/useSignin";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/Button";

const SigninForm = () => {
    const { form, isSubmitButtonDisabled, onSubmit, onBack, loading } = useSignin();

    return (
        <div className='flex items-center w-full h-full max-w-[1230px] mx-auto px-3 box-border'>
            <div className='flex flex-col gap-2 items-end pr-10 max-md:hidden'>
                <h1 className='text-6xl max-lg:text-4xl font-bold text-white text-balance text-right'>Sign in</h1>
                <p className='text-xl max-lg:text-base text-white opacity-50 text-right'>
                    Enter your username and password
                </p>
            </div>
            <Form {...form}>
                <div className='flex max-md:justify-center flex-1 md:pl-10 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col gap-4 h-full justify-center md:min-w-[560px] max-md:max-w-[500px] max-md:w-full'
                    >
                        <FormField
                            name='email'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Enter your email address'
                                            className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='password'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            placeholder='Enter your password'
                                            className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                                            value={field.value.replace(/\s/g, "")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex w-full items-center justify-between mt-5'>
                            <Button
                                type='button'
                                variant='secondary'
                                className='w-24'
                                onClick={onBack}
                                disabled={loading}
                            >
                                Back
                            </Button>
                            <Button className='w-24' disabled={isSubmitButtonDisabled}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </Form>
        </div>
    );
};

export default SigninForm;