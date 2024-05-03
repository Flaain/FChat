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
        <div className='flex items-center w-full h-full max-w-[1230px] mx-auto box-border'>
            <div className='flex flex-col gap-3 items-end px-10 max-lg:px-5 max-md:hidden'>
                <Typography variant='primary' as='h1' size='6xl' weight='bold' align='right'>
                    Sign in
                </Typography>
                <Typography as='p' size='xl' variant='secondary' align='right'>
                    Enter your email or username and password
                </Typography>
            </div>
            <Form {...form}>
                <AuthContainer>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col gap-4 h-full justify-center max-w-[560px] w-full'
                    >
                        <FormField
                            name='str'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Email or Name</FormLabel>
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