import Typography from "@/shared/ui/Typography";
import { PasswordInput } from "@/shared/ui/PasswordInput";
import { useSignin } from "../../lib/hooks/useSignin";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { LoaderCircle } from "lucide-react";
import { AuthContainer } from "../AuthContainer";

const SigninForm = () => {
    const { form, isSubmitButtonDisabled, onSubmit, onBack, loading } = useSignin();

    return (
        <div className='flex items-center w-full h-full max-w-[1230px] box-border gap-5'>
            <div className='flex flex-col gap-2 items-end max-md:hidden max-w-[450px] w-full'>
                <Typography variant='primary' as='h1' size='6xl' weight='bold' align='right' className='max-lg:text-6xl'>
                    Sign in
                </Typography>
                <Typography as='p' size='xl' variant='secondary' align='right' className='max-lg:text-xl'>
                    Enter your email or username and password
                </Typography>
            </div>
            <Form {...form}>
                <AuthContainer>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col gap-4 h-full justify-center md:min-w-[400px] max-w-[560px] w-full'
                    >
                        <FormField
                            name='login'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Login</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Enter your email address or name'
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
                                {loading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : "Submit"}
                            </Button>
                        </div>
                    </form>
                </AuthContainer>
            </Form>
        </div>
    );
};

export default SigninForm;